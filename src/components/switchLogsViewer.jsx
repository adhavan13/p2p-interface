// ============================================
// COMPONENT 6: SWITCH LOGS VIEWER
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
const SwitchLogsViewer = ({ logs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBank, setFilterBank] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesBank = filterBank === "all" || log.bank === filterBank;
      const matchesStatus =
        filterStatus === "all" || log.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        log.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBank && matchesStatus && matchesSearch;
    });
  }, [logs, filterBank, filterStatus, searchQuery]);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getStatusColor = (status) => {
    const colors = {
      SUCCESS: "text-green-600 bg-green-100",
      FAILED: "text-red-600 bg-red-100",
      PROCESSING: "text-blue-600 bg-blue-100",
      RETRYING: "text-yellow-600 bg-yellow-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Switch Logs
        </CardTitle>
        <CardDescription>
          Real-time transaction logs with advanced filtering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="🔍 Search by Txn ID or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Banks</option>
            <option value="SBI">SBI</option>
            <option value="HDFC">HDFC</option>
            <option value="AXIS">AXIS</option>
            <option value="ICICI">ICICI</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="RETRYING">RETRYING</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold">Time</th>
                <th className="px-4 py-3 text-left font-semibold">Txn ID</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Message</th>
                <th className="px-4 py-3 text-left font-semibold">Bank</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Attempts
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono">{log.time}</td>
                  <td className="px-4 py-3 font-mono text-sm">{log.txnId}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{log.message}</td>
                  <td className="px-4 py-3 font-medium">{log.bank}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-gray-100 rounded font-semibold">
                      {log.attempts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {paginatedLogs.length} of {filteredLogs.length} logs
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
            <span className="px-3 py-1 border rounded bg-gray-50">
              {currentPage} / {totalPages}
            </span>
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

export default SwitchLogsViewer;
