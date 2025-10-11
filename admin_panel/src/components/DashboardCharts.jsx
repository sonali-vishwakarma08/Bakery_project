import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function BakeryDashboardCharts() {
  const [salesData, setSalesData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [customerGrowthData, setCustomerGrowthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch all chart data in parallel
        const [salesRes, categoryRes, customerRes] = await Promise.all([
          axios.get("http://localhost:5000/api/dashboard/sales-chart", config),
          axios.get("http://localhost:5000/api/dashboard/category-chart", config),
          axios.get("http://localhost:5000/api/dashboard/customer-growth-chart", config),
        ]);

        setSalesData(salesRes.data);
        setCategoryData(categoryRes.data);
        setCustomerGrowthData(customerRes.data);
      } catch (err) {
        console.error("Failed to fetch chart data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Adjusted common chart options
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        top: 10,
        bottom: 20, // increased bottom padding
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          font: {
            size: 10,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 },
        },
      },
      y: {
        ticks: {
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Monthly Sales Bar Chart */}
      <div className="bg-white shadow rounded-lg p-3 h-[220px] overflow-hidden flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Monthly Sales</h2>
        <div className="flex-1">
          {loading ? (
            <div className="bg-gray-200 animate-pulse h-full rounded"></div>
          ) : salesData ? (
            <Bar data={salesData} options={chartOptions} />
          ) : (
            <p className="text-center text-gray-400 py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Product Category Doughnut Chart */}
      <div className="bg-white shadow rounded-lg p-3 h-[220px] overflow-hidden flex flex-col items-center justify-center">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Product Categories</h2>
        <div className="w-[180px] h-[180px] flex items-center justify-center">
          {loading ? (
            <div className="bg-gray-200 animate-pulse w-full h-full rounded-full"></div>
          ) : categoryData ? (
            <Doughnut
              data={categoryData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                  padding: 5,
                },
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      boxWidth: 10,
                      font: { size: 10 },
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-center text-gray-400">No data available</p>
          )}
        </div>
      </div>

      {/* Customer Growth Line Chart */}
      <div className="bg-white shadow rounded-lg p-3 h-[220px] overflow-hidden flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Customer Growth</h2>
        <div className="flex-1">
          {loading ? (
            <div className="bg-gray-200 animate-pulse h-full rounded"></div>
          ) : customerGrowthData ? (
            <Line data={customerGrowthData} options={chartOptions} />
          ) : (
            <p className="text-center text-gray-400 py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
