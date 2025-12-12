// ============================================
// COMPONENT 1: ACTIVE TRANSACTIONS TABLE
// ============================================

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const ActiveTransactionsTable = ({ transactions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 5;

  const sortedTransactions = useMemo(() => {
    if (!sortConfig.key) return transactions;

    return [...transactions].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [transactions, sortConfig]);

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      SUCCESS: "text-green-600 bg-green-100",
      PROCESSING: "text-blue-600 bg-blue-100",
      FAILED: "text-red-600 bg-red-100",
      RETRYING: "text-yellow-600 bg-yellow-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Active Transactions
        </CardTitle>
        <CardDescription>
          Real-time transaction monitoring via WebSocket
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("txnId")}
                >
                  Txn ID{" "}
                  {sortConfig.key === "txnId" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("senderVpa")}
                >
                  Sender VPA{" "}
                  {sortConfig.key === "senderVpa" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("receiverVpa")}
                >
                  Receiver VPA{" "}
                  {sortConfig.key === "receiverVpa" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("amount")}
                >
                  Amount{" "}
                  {sortConfig.key === "amount" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("attempts")}
                >
                  Attempts{" "}
                  {sortConfig.key === "attempts" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("latency")}
                >
                  Latency (ms){" "}
                  {sortConfig.key === "latency" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("bank")}
                >
                  Bank{" "}
                  {sortConfig.key === "bank" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-sm">{txn.txnId}</td>
                  <td className="px-4 py-3 text-sm">{txn.senderVpa}</td>
                  <td className="px-4 py-3 text-sm">{txn.receiverVpa}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        txn.status
                      )}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{txn.attempts}</td>
                  <td className="px-4 py-3 text-right">{txn.latency}ms</td>
                  <td className="px-4 py-3 font-medium">{txn.bank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} • {transactions.length} total
            transactions
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveTransactionsTable;
