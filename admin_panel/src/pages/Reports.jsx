import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError, showInfo } from "../utils/toast";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaChartBar, FaUsers, FaShoppingCart, FaBoxOpen } from "react-icons/fa";

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState({
    sales: null,
    customers: null,
    products: null,
    orders: null,
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [statsRes, ordersRes, customersRes, productsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/dashboard/dashboard-stats", config),
        axios.post("http://localhost:5000/api/orders/all", {}, config),
        axios.post("http://localhost:5000/api/user/all", { role: "customer" }, config),
        axios.get("http://localhost:5000/api/products/all", config),
      ]);

      setReportData({
        sales: statsRes.data,
        orders: ordersRes.data,
        customers: customersRes.data,
        products: productsRes.data,
      });
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      showError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const generateSalesReport = () => {
    if (!reportData.orders) {
      showError("No data available");
      return;
    }

    const csvContent = [
      ["Order ID", "Customer", "Total Amount", "Status", "Date"],
      ...reportData.orders.map(order => {
        const date = new Date(order.createdAt);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        return [
          order._id,
          order.user?.name || "Guest",
          order.total_amount || 0,
          order.status,
          formattedDate,
        ];
      })
    ].map(row => row.join("\t")).join("\n"); // Use tab separator

    downloadCSV(csvContent, "sales-report.xls"); // Change to .xls
    showSuccess("Sales report downloaded!");
  };

  const generateCustomerReport = () => {
    if (!reportData.customers) {
      showError("No data available");
      return;
    }

    const csvContent = [
      ["Customer ID", "Name", "Email", "Phone", "Status", "Joined Date"],
      ...reportData.customers.map(customer => {
        const date = new Date(customer.createdAt);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        return [
          customer._id,
          customer.name,
          customer.email,
          `'${customer.phone || "N/A"}`, // Add apostrophe prefix to force text
          customer.status || "active",
          formattedDate,
        ];
      })
    ].map(row => row.join("\t")).join("\n"); // Use tab separator

    downloadCSV(csvContent, "customer-report.xls"); // Change to .xls
    showSuccess("Customer report downloaded!");
  };

  const generateProductReport = () => {
    if (!reportData.products) {
      showError("No data available");
      return;
    }

    const csvContent = [
      ["Product ID", "Name", "Category", "SubCategory", "Price", "Stock", "Status"],
      ...reportData.products.map(product => [
        product._id,
        product.name,
        product.category?.name || "N/A",
        product.subcategory?.name || "N/A",
        product.price,
        product.stock_quantity,
        product.status,
      ])
    ].map(row => row.join("\t")).join("\n"); // Use tab separator

    downloadCSV(csvContent, "product-report.xls"); // Change to .xls
    showSuccess("Product report downloaded!");
  };

  const generateInventoryReport = () => {
    if (!reportData.products) {
      showError("No data available");
      return;
    }

    const lowStockProducts = reportData.products.filter(p => p.stock_quantity < 10);
    
    const csvContent = [
      ["Product ID", "Name", "Current Stock", "Status", "Alert"],
      ...lowStockProducts.map(product => [
        product._id,
        product.name,
        product.stock_quantity,
        product.status,
        product.stock_quantity === 0 ? "OUT OF STOCK" : "LOW STOCK",
      ])
    ].map(row => row.join("\t")).join("\n"); // Use tab separator

    downloadCSV(csvContent, "inventory-report.xls"); // Change to .xls
    showSuccess("Inventory report downloaded!");
  };

  const downloadCSV = (content, filename) => {
    // Add BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + content], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportCards = [
    {
      title: "Sales Report",
      description: "Complete sales and order details",
      icon: <FaChartBar className="text-3xl text-pink-500" />,
      color: "bg-pink-50",
      count: reportData.orders?.length || 0,
      action: generateSalesReport,
    },
    {
      title: "Customer Report",
      description: "Customer list and activity",
      icon: <FaUsers className="text-3xl text-blue-500" />,
      color: "bg-blue-50",
      count: reportData.customers?.length || 0,
      action: generateCustomerReport,
    },
    {
      title: "Product Report",
      description: "Product inventory and details",
      icon: <FaBoxOpen className="text-3xl text-green-500" />,
      color: "bg-green-50",
      count: reportData.products?.length || 0,
      action: generateProductReport,
    },
    {
      title: "Inventory Alert",
      description: "Low stock and out of stock items",
      icon: <FaShoppingCart className="text-3xl text-yellow-500" />,
      color: "bg-yellow-50",
      count: reportData.products?.filter(p => p.stock_quantity < 10).length || 0,
      action: generateInventoryReport,
    },
  ];

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
            <p className="text-gray-500 text-sm mt-1">Generate and download various business reports</p>
          </div>
          <button
            onClick={fetchReportData}
            disabled={loading}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportCards.map((report, index) => (
            <div
              key={index}
              className={`${report.color} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                  {report.icon}
                </div>
                <span className="text-2xl font-bold text-gray-800">{report.count}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button
                onClick={report.action}
                disabled={loading || report.count === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFileDownload />
                <span>Download CSV</span>
              </button>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{reportData.sales?.totalIncome?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.sales?.totalSales || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.sales?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportData.sales?.totalProducts || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
