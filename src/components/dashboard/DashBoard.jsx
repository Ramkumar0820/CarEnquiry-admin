"use client";
import CarListing from "@/components/block/carListing";
import React, { useEffect, useState } from "react";
import {
  FaCar,
  FaCheckCircle,
  FaMoneyBillWave,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ----------------- Format Amount -----------------
const formatAmount = (amount) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

// ----------------- Custom Tooltip -----------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const monthData = payload[0]?.payload;
    if(monthData.amount){ 
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        <p className="text-blue-500">Revenue: {formatAmount(monthData.amount)}</p>
        <p className="text-green-500">Cars Sold: {monthData.count} car{monthData.count !== 1 ? "s" : ""}</p>
      </div>
    );
  }
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
      const res = await fetch(`/api/dashboard${year ? `?year=${year}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
      if (!selectedYear) setSelectedYear(json.monthWiseSales?.year);
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

  return (
    <div className="px-2 sm:px-4 py-2 bg-gray-50 min-h-full font-sans border border-gray-200 rounded-md">
      
      {/* Header */}
      <div className="flex justify-between py-2 sm:py-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          Admin Dashboard
        </h1>
      </div>

      {/* ----------------- Cards ----------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 w-full">
        
        {/* Total Cars */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 hover:shadow">
          <FaCar className="text-3xl text-red-500" />
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Number of Cars</p>
            <h2 className="text-2xl font-semibold text-gray-700">
              {loading ? "..." : data?.totalCars}
            </h2>
          </div>
        </div>

        {/* Cars Sold */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 hover:shadow">
          <FaCheckCircle className="text-3xl text-green-500" />
          <div>
            <p className="text-sm text-gray-500 font-semibold">Number of Cars Sold</p>
            <h2 className="text-2xl font-semibold text-gray-700">
              {loading ? "..." : data?.outOfStock}
            </h2>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 hover:shadow">
          <FaMoneyBillWave className="text-3xl text-emerald-500" />
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Revenue</p>
            <h2 className="text-2xl font-semibold text-gray-700">
              {loading ? "..." : formatAmount(data?.totalSoldAmount ?? 0)}
            </h2>
          </div>
        </div>

        {/* Pending Inquiry */}
        <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4 hover:shadow">
          <FaQuestionCircle className="text-3xl text-orange-500" />
          <div>
            <p className="text-sm text-gray-500 font-semibold">Pending Inquiry</p>
            <h2 className="text-2xl font-semibold text-gray-700">
              {loading ? "..." : data?.pendingInquiries}
            </h2>
          </div>
        </div>
      </div>

      {/* ----------------- Monthly Sales Chart ----------------- */}
      <div className="bg-white rounded-xl shadow-sm p-2 md:p-4 mt-10">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            Monthly Sales — {data?.monthWiseSales?.year}
          </h2>

          {/* Year Buttons */}
          <div className="flex gap-2 flex-wrap">
            {data?.availableYears?.map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedYear === yr
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Loading chart...
          </div>
        ) : (
          <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.monthWiseSales?.months}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 15, fill: "#6b7280" }} />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickFormatter={formatAmount}
                tick={{ fontSize: 15, fill: "#6b7280" }}
              />
              {/* <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#6b7280" }}
              /> */}
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend />
              <Bar yAxisId="left"  dataKey="amount" name="Revenue"   fill="#3b82f6" radius={[6, 6, 0, 0]} />
              {/* <Bar yAxisId="right" dataKey="count"  name="Cars Sold" fill="#10b981" radius={[6, 6, 0, 0]} /> */}
            </BarChart>
          </ResponsiveContainer>
          </div>
        )}
      </div>

       <CarListing/>

    </div>
  );
};

export default DashBoard;