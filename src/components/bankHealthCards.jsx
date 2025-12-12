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

// ============================================
// COMPONENT 5: BANK HEALTH CARDS
// ============================================
const BankHealthCards = ({ banks }) => {
  const getStatusIcon = (status) => {
    if (status === "healthy")
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "warning")
      return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBorder = (status) => {
    if (status === "healthy") return "border-l-4 border-green-600";
    if (status === "warning") return "border-l-4 border-yellow-600";
    return "border-l-4 border-red-600";
  };

  const getStatusBadge = (status) => {
    if (status === "healthy") return "bg-green-100 text-green-700";
    if (status === "warning") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {banks.map((bank, idx) => (
        <Card
          key={idx}
          className={`${getStatusBorder(
            bank.status
          )} hover:shadow-lg transition-shadow`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg">{bank.bank}</span>
              {getStatusIcon(bank.status)}
            </CardTitle>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(
                bank.status
              )} uppercase font-semibold`}
            >
              {bank.status}
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Latency:</span>
                <span className="font-semibold text-lg">
                  {bank.avgLatency}ms
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-semibold text-lg text-green-600">
                  {bank.successRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Retry Count:</span>
                <span className="font-semibold text-lg">{bank.retryCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BankHealthCards;
