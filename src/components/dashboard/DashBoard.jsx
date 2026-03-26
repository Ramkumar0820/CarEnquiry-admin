"use client";
import React, { useEffect, useState } from "react";
import {
  Car,
  CheckCircle,
  DollarSign,
  IndianRupee,
  HelpCircle
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  Line
} from "recharts";

// ----------------- Format Amount (₹ Indian Format) -----------------
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

// ----------------- Compact Format for Chart -----------------
const formatCompact = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

// ----------------- Custom Tooltip -----------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>

        <p className="text-blue-500">
          Revenue: {formatAmount(data?.amount || 0)}
        </p>

        <p className="text-green-500">
          Cars Booked: {data?.count || 0}
        </p>
      </div>
    );
  }
  return null;
};

const DashBoard = () => {
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (year = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard${year ? `?year=${year}` : ""}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");

      const json = await res.json();
      setData(json);

      if (!selectedYear) {
        setSelectedYear(json.monthWiseSales?.year);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchData(year);
  };

  // ----------------- Cards -----------------
  const cards = [
    {
      title: "Total Cars",
      value: data?.totalCars,
      icon: Car,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Cars Booked",
      value: data?.outOfStock,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Total Revenue",
      value: formatAmount(data?.totalSoldAmount ?? 0),
      icon: IndianRupee,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Pending Inquiry",
      value: data?.pendingInquiries,
      icon: HelpCircle,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  // ----------------- Pie Data -----------------
  const pieData = [
    {
      name: "Available Cars",
      value:
        (data?.totalCars || 0) - (data?.outOfStock || 0),
    },
    {
      name: "Booked Cars",
      value: data?.outOfStock || 0,
    },
    {
      name: "Pending Inquiry",
      value: data?.pendingInquiries || 0,
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="px-3 sm:px-6 py-4 bg-gray-50 min-h-screen">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard Overview
      </h1>

      {/* ----------------- Cards ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {cards.map((card, i) => {
          const Icon = card.icon;

          return (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${card.color}`}></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {loading ? "..." : card.value}
                  </h2>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------- Charts ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        {/* Bar + Line Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border flex flex-col">

          <div className="flex flex-col sm:flex-row justify-between mb-5 gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Monthly Sales — {data?.monthWiseSales?.year}
            </h2>

            <div className="flex gap-2 flex-wrap">
              {data?.availableYears?.map((yr) => (
                <button
                  key={yr}
                  onClick={() => handleYearChange(yr)}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    selectedYear === yr
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse h-[250px] w-full bg-gray-100 rounded-xl" />
            </div>
          ) : (
            <div className="flex-1 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.monthWiseSales?.months}>

                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={formatCompact} />
                  <YAxis yAxisId="right" orientation="right" />

                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  <Bar
                    yAxisId="left"
                    dataKey="amount"
                    fill="url(#barGradient)"
                    radius={[6, 6, 0, 0]}
                  />

                  <Line
                    yAxisId="right"
                    dataKey="count"
                    stroke="#10b981"
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border flex flex-col">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Overview Distribution
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse h-[250px] w-full bg-gray-100 rounded-xl" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6">

              <div className="h-[220px] w-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={55} outerRadius={85}>
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-3">
                {pieData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashBoard;