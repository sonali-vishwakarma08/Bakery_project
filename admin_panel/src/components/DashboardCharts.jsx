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

  useEffect(() => {
    const fetchData = async () => {
      const mockSales = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Monthly Sales (₹)",
            data: [12000, 15000, 18000, 22000, 20000, 25000],
            backgroundColor: "#f472b6",
            borderRadius: 6,
          },
        ],
      };

      const mockCategories = {
        labels: ["Cakes", "Pastries", "Cookies", "Bread"],
        datasets: [
          {
            label: "Product Categories",
            data: [40, 25, 20, 15],
            backgroundColor: ["#f472b6", "#fb923c", "#34d399", "#60a5fa"],
            borderWidth: 1,
          },
        ],
      };

      const mockCustomers = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "New Customers",
            data: [50, 65, 80, 90, 100, 120],
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96, 165, 250, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      };

      setSalesData(mockSales);
      setCategoryData(mockCategories);
      setCustomerGrowthData(mockCustomers);
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
          {salesData ? (
            <Bar data={salesData} options={chartOptions} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>

      {/* Product Category Doughnut Chart */}
      <div className="bg-white shadow rounded-lg p-3 h-[220px] overflow-hidden flex flex-col items-center justify-center">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Product Categories</h2>
        <div className="w-[180px] h-[180px] flex items-center justify-center"> {/* larger size */}
          {categoryData ? (
            <Doughnut
              data={categoryData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                  padding: 5, // minimal padding
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
            <p>Loading chart...</p>
          )}
        </div>
      </div>

      {/* Customer Growth Line Chart */}
      <div className="bg-white shadow rounded-lg p-3 h-[220px] overflow-hidden flex flex-col">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">Customer Growth</h2>
        <div className="flex-1">
          {customerGrowthData ? (
            <Line data={customerGrowthData} options={chartOptions} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
    </div>
  );
}
