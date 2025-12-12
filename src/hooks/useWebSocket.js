// ============================================
// WEBSOCKET HOOK

import React, { useState, useEffect, useMemo } from "react";

// ============================================
const useWebSocket = () => {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    retryCountPerBank: [],
    latencyPerBank: [],
    statusDistribution: [],
    bankHealth: [],
    logs: [],
  });

  useEffect(() => {
    // Initial data
    const initialTransactions = [
      {
        txnId: "TXN001",
        senderVpa: "user1@paytm",
        receiverVpa: "user2@phonepe",
        amount: 500,
        status: "SUCCESS",
        attempts: 1,
        latency: 245,
        bank: "SBI",
      },
      {
        txnId: "TXN002",
        senderVpa: "user3@gpay",
        receiverVpa: "user4@paytm",
        amount: 1200,
        status: "PROCESSING",
        attempts: 1,
        latency: 180,
        bank: "HDFC",
      },
      {
        txnId: "TXN003",
        senderVpa: "user5@phonepe",
        receiverVpa: "user6@gpay",
        amount: 750,
        status: "FAILED",
        attempts: 3,
        latency: 890,
        bank: "AXIS",
      },
      {
        txnId: "TXN004",
        senderVpa: "user7@paytm",
        receiverVpa: "user8@phonepe",
        amount: 2000,
        status: "RETRYING",
        attempts: 2,
        latency: 650,
        bank: "ICICI",
      },
      {
        txnId: "TXN005",
        senderVpa: "user9@gpay",
        receiverVpa: "user10@paytm",
        amount: 300,
        status: "SUCCESS",
        attempts: 1,
        latency: 210,
        bank: "SBI",
      },
    ];

    const initialMetrics = {
      retryCountPerBank: [
        { bank: "SBI", retries: 12 },
        { bank: "HDFC", retries: 8 },
        { bank: "AXIS", retries: 15 },
        { bank: "ICICI", retries: 6 },
      ],
      latencyPerBank: [
        { time: "10:00", SBI: 240, HDFC: 180, AXIS: 320, ICICI: 200 },
        { time: "10:05", SBI: 230, HDFC: 190, AXIS: 310, ICICI: 210 },
        { time: "10:10", SBI: 245, HDFC: 185, AXIS: 330, ICICI: 205 },
        { time: "10:15", SBI: 250, HDFC: 195, AXIS: 340, ICICI: 215 },
      ],
      statusDistribution: [
        { name: "SUCCESS", value: 450, color: "#10b981" },
        { name: "FAILED", value: 80, color: "#ef4444" },
        { name: "TIMEOUT", value: 25, color: "#f59e0b" },
      ],
      bankHealth: [
        {
          bank: "SBI",
          status: "healthy",
          avgLatency: 245,
          successRate: 94.5,
          retryCount: 12,
        },
        {
          bank: "HDFC",
          status: "warning",
          avgLatency: 290,
          successRate: 88.2,
          retryCount: 18,
        },
        {
          bank: "AXIS",
          status: "critical",
          avgLatency: 450,
          successRate: 72.8,
          retryCount: 35,
        },
        {
          bank: "ICICI",
          status: "healthy",
          avgLatency: 210,
          successRate: 96.1,
          retryCount: 8,
        },
      ],
      logs: [
        {
          time: "10:15:23",
          txnId: "TXN005",
          status: "SUCCESS",
          message: "Transaction completed",
          bank: "SBI",
          attempts: 1,
        },
        {
          time: "10:15:20",
          txnId: "TXN004",
          status: "RETRYING",
          message: "Timeout from bank",
          bank: "ICICI",
          attempts: 2,
        },
        {
          time: "10:15:18",
          txnId: "TXN003",
          status: "FAILED",
          message: "Insufficient balance",
          bank: "AXIS",
          attempts: 3,
        },
        {
          time: "10:15:15",
          txnId: "TXN002",
          status: "PROCESSING",
          message: "Request sent to bank",
          bank: "HDFC",
          attempts: 1,
        },
        {
          time: "10:15:10",
          txnId: "TXN001",
          status: "SUCCESS",
          message: "Transaction completed",
          bank: "SBI",
          attempts: 1,
        },
      ],
    };

    setTransactions(initialTransactions);
    setMetrics(initialMetrics);

    // Simulate WebSocket updates every 3 seconds
    const interval = setInterval(() => {
      const newTxn = {
        txnId: `TXN${String(Math.floor(Math.random() * 9999)).padStart(
          3,
          "0"
        )}`,
        senderVpa: `user${Math.floor(Math.random() * 100)}@${
          ["paytm", "gpay", "phonepe"][Math.floor(Math.random() * 3)]
        }`,
        receiverVpa: `user${Math.floor(Math.random() * 100)}@${
          ["paytm", "gpay", "phonepe"][Math.floor(Math.random() * 3)]
        }`,
        amount: Math.floor(Math.random() * 5000) + 100,
        status: ["SUCCESS", "PROCESSING", "FAILED", "RETRYING"][
          Math.floor(Math.random() * 4)
        ],
        attempts: Math.floor(Math.random() * 3) + 1,
        latency: Math.floor(Math.random() * 800) + 150,
        bank: ["SBI", "HDFC", "AXIS", "ICICI"][Math.floor(Math.random() * 4)],
      };

      setTransactions((prev) => [newTxn, ...prev.slice(0, 19)]);

      setMetrics((prev) => ({
        ...prev,
        latencyPerBank: [
          ...prev.latencyPerBank.slice(1),
          {
            time: new Date().toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            SBI: Math.floor(Math.random() * 100) + 200,
            HDFC: Math.floor(Math.random() * 100) + 180,
            AXIS: Math.floor(Math.random() * 100) + 300,
            ICICI: Math.floor(Math.random() * 100) + 190,
          },
        ],
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { transactions, metrics };
};

export default useWebSocket;
