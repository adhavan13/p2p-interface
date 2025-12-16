"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

import ActiveTransactionsTable from "@/components/activeTransactionsTable";
import RetryCountChart from "@/components/retryCountChart";
import LatencyChart from "@/components/latencyChart";
import StatusDistributionChart from "@/components/statusDistributionChart";
import BankHealthCards from "@/components/bankHealthCards";
import SwitchLogsViewer from "@/components/switchLogsViewer";
import useWebSocket from "@/hooks/useWebSocket";
import axios from "axios";

export default function UPISwitchDashboard() {
  const { transactions, metrics } = useWebSocket();
  const [showLoadTestModal, setShowLoadTestModal] = useState(false);
  const [loadTestConfig, setLoadTestConfig] = useState({
    vus: 10,
    numRequests: 100,
    enableLoadBalancer: false,
  });

  const handleLoadTestChange = (field, value) => {
    setLoadTestConfig((prev) => ({
      ...prev,
      [field]: value,
      [field]: value,
    }));
  };

  const handleLoadTestSubmit = async () => {
    console.log("Load Test Config:", loadTestConfig);
    // TODO: Send to k6 simulation endpoint
    // For now, just close the modal
    setShowLoadTestModal(false);
    const res = await axios.post("http://localhost:3001/api/simulation/run", {
      vus: loadTestConfig.vus,
      iterations: loadTestConfig.numRequests,
    });
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Monitoring</span>
            </div>
            <button
              onClick={() => setShowLoadTestModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Load Test Simulation
            </button>
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

        {/* Load Test Simulation Modal */}
        {showLoadTestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Load Test Simulation
                </h2>
                <button
                  onClick={() => setShowLoadTestModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Number of Requests Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Requests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={loadTestConfig.vus}
                    onChange={(e) =>
                      handleLoadTestChange("vus", parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Requests Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Requests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={loadTestConfig.numRequests}
                    onChange={(e) =>
                      handleLoadTestChange(
                        "numRequests",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Load Balancer Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableLoadBalancer"
                    checked={loadTestConfig.enableLoadBalancer}
                    onChange={(e) =>
                      handleLoadTestChange(
                        "enableLoadBalancer",
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="enableLoadBalancer"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Enable Load Balancer
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowLoadTestModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLoadTestSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
