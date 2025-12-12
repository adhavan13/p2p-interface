"use client";

import React from "react";

import ActiveTransactionsTable from "@/components/activeTransactionsTable";
import RetryCountChart from "@/components/retryCountChart";
import LatencyChart from "@/components/latencyChart";
import StatusDistributionChart from "@/components/statusDistributionChart";
import BankHealthCards from "@/components/bankHealthCards";
import SwitchLogsViewer from "@/components/switchLogsViewer";
import useWebSocket from "@/hooks/useWebSocket";

export default function UPISwitchDashboard() {
  const { transactions, metrics } = useWebSocket();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              NPCI UPI Switch Monitor
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time transaction monitoring and analytics dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Monitoring</span>
          </div>
        </div>

        {/* Bank Health Cards */}
        <BankHealthCards banks={metrics.bankHealth} />

        {/* Active Transactions Table */}
        <ActiveTransactionsTable transactions={transactions} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RetryCountChart data={metrics.retryCountPerBank} />
          <StatusDistributionChart data={metrics.statusDistribution} />
        </div>

        {/* Latency Chart */}
        <LatencyChart data={metrics.latencyPerBank} />

        {/* Switch Logs Viewer */}
        <SwitchLogsViewer logs={metrics.logs} />
      </div>
    </div>
  );
}
