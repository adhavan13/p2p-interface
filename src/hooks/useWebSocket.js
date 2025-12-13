import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002", {
  transports: ["websocket"],
});

const useWebSocket = () => {
  // -------------------------------
  // Raw transaction stream
  const [transactions, setTransactions] = useState([]);

  // -------------------------------
  // Socket lifecycle
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Frontend connected:", socket.id);
    });

    socket.on("transaction:update", (event) => {
      setTransactions((prev) => {
        const idx = prev.findIndex((t) => t.txnId === event.txnId);

        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...event };
          return updated;
        }

        return [event, ...prev].slice(0, 500); // keep last 500
      });
    });

    return () => {
      socket.off("transaction:update");
      socket.off("connect");
    };
  }, []);

  // -------------------------------
  // DERIVED METRICS (FROM REAL DATA)
  const metrics = useMemo(() => {
    const retryCountPerBank = {};
    const latencyAgg = {};
    const statusDistribution = {};
    const bankStats = {};
    const logs = [];

    transactions.forEach((txn) => {
      const bank = txn.bank;

      // ---------- Retry count ----------
      if (txn.attempts > 1) {
        retryCountPerBank[bank] =
          (retryCountPerBank[bank] || 0) + (txn.attempts - 1);
      }

      // ---------- Latency ----------
      if (txn.latency != null) {
        latencyAgg[bank] = latencyAgg[bank] || { sum: 0, count: 0 };
        latencyAgg[bank].sum += txn.latency;
        latencyAgg[bank].count += 1;
      }

      // ---------- Status distribution ----------
      statusDistribution[txn.status] =
        (statusDistribution[txn.status] || 0) + 1;

      // ---------- Bank health ----------
      if (!bankStats[bank]) {
        bankStats[bank] = {
          bank,
          total: 0,
          success: 0,
          latencies: [],
          retries: 0,
        };
      }

      bankStats[bank].total += 1;
      if (txn.status === "SUCCESS") bankStats[bank].success += 1;
      if (txn.latency != null) bankStats[bank].latencies.push(txn.latency);
      if (txn.attempts > 1) bankStats[bank].retries += txn.attempts - 1;

      // ---------- Logs ----------
      logs.push({
        time: new Date(txn.timestamp).toLocaleTimeString(),
        txnId: txn.txnId,
        status: txn.status,
        bank,
        attempts: txn.attempts,
        message: txn.status,
      });
    });

    // ---------- Final shapes ----------
    return {
      retryCountPerBank: Object.entries(retryCountPerBank).map(
        ([bank, retries]) => ({ bank, retries })
      ),

      latencyPerBank: Object.entries(latencyAgg).map(([bank, v]) => ({
        bank,
        avgLatency: Math.round(v.sum / v.count),
      })),

      statusDistribution: Object.entries(statusDistribution).map(
        ([name, value]) => ({ name, value })
      ),

      bankHealth: Object.values(bankStats).map((b) => {
        const avgLatency =
          b.latencies.reduce((a, c) => a + c, 0) / (b.latencies.length || 1);

        const successRate = (b.success / b.total) * 100;

        return {
          bank: b.bank,
          avgLatency: Math.round(avgLatency),
          successRate: successRate.toFixed(1),
          retryCount: b.retries,
          status:
            successRate > 90
              ? "healthy"
              : successRate > 75
              ? "warning"
              : "critical",
        };
      }),

      logs: logs.slice(0, 50),
    };
  }, [transactions]);

  return { transactions, metrics };
};

export default useWebSocket;
