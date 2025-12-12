import { useState, useEffect } from "react";
import API from "../api/api";
import { showSuccess, showError } from "../utils/toast";
import { FaFileDownload, FaFilePdf, FaFileExcel, FaChartBar, FaUsers, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import jsPDF from "jspdf";
// Import autotable to ensure it's attached to jsPDF prototype
import "jspdf-autotable";
// Import autoTable function for direct usage
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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

  const fetchReportData = async (retryCount = 0) => {
    try {
      setLoading(true);

      // Add timeout to prevent hanging requests
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const fetchData = Promise.all([
        API.get("/dashboard/dashboard-stats"),
        API.post("/orders/all", {}),
        API.post("/users/all", { role: "customer" }),
        API.get("/products/all"),
      ]);

      const [statsRes, ordersRes, customersRes, productsRes] = await Promise.race([
        fetchData,
        timeout
      ]);

      setReportData({
        sales: statsRes.data,
        orders: Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.orders || []),
        customers: Array.isArray(customersRes.data) ? customersRes.data : (customersRes.data?.users || []),
        products: Array.isArray(productsRes.data) ? productsRes.data : (productsRes.data?.products || []),
      });
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      
      // Retry up to 2 times on network errors
      if (retryCount < 2 && (err.message.includes('timeout') || err.message.includes('network'))) {
        console.log(`Retrying report fetch... (${retryCount + 1})`);
        setTimeout(() => fetchReportData(retryCount + 1), 2000);
        return;
      }
      
      showError("Failed to load report data: " + (err.message || "Unknown error"));
      // Reset data on error
      setReportData({
        sales: null,
        customers: null,
        products: null,
        orders: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSalesReport = (format = 'excel') => {
    if (!reportData.orders || !Array.isArray(reportData.orders)) {
      showError("No data available");
      return;
    }

    const headers = ["Order ID", "Customer", "Total Amount", "Status", "Date"];
    const rows = reportData.orders.map(order => [
      order._id?.substring(0, 8) || 'N/A',
      order.user?.name || "Guest",
      formatCurrency(order.total_amount || 0),
      formatStatus(order.status),
      formatDate(order.createdAt),
    ]);

    if (format === 'pdf') {
      downloadPDF('Sales Report', headers, rows, 'sales-report.pdf');
    } else {
      const csvContent = generateExcelContent(headers, rows);
      downloadCSV(csvContent, "sales-report.xlsx");
    }
    // Success message now handled in download functions
  };

  const generateCustomerReport = (format = 'excel') => {
    if (!reportData.customers || !Array.isArray(reportData.customers)) {
      showError("No data available");
      return;
    }

    const headers = ["Customer ID", "Name", "Email", "Phone", "Status", "Joined Date"];
    const rows = reportData.customers.map(customer => [
      customer._id?.substring(0, 8) || 'N/A',
      customer.name || 'N/A',
      formatEmail(customer.email),
      formatPhoneNumber(customer.phone),
      formatStatus(customer.status || 'active'),
      formatDate(customer.createdAt),
    ]);

    if (format === 'pdf') {
      downloadPDF('Customer Report', headers, rows, 'customer-report.pdf');
    } else {
      const csvContent = generateExcelContent(headers, rows);
      downloadCSV(csvContent, "customer-report.xlsx");
    }
    // Success message now handled in download functions
  };

  const generateProductReport = (format = 'excel') => {
    if (!reportData.products || !Array.isArray(reportData.products)) {
      showError("No data available");
      return;
    }

    const headers = ["Product ID", "Name", "Category", "SubCategory", "Price", "Stock", "Status"];
    const rows = reportData.products.map(product => [
      product._id?.substring(0, 8) || 'N/A',
      formatProductName(product.name),
      product.category?.name || 'N/A',
      product.subcategory?.name || 'N/A',
      formatCurrency(product.price || 0),
      product.stock_quantity || 0,
      formatStatus(product.status),
    ]);

    if (format === 'pdf') {
      downloadPDF('Product Report', headers, rows, 'product-report.pdf');
    } else {
      const csvContent = generateExcelContent(headers, rows);
      downloadCSV(csvContent, "product-report.xlsx");
    }
    // Success message now handled in download functions
  };

  const generateInventoryReport = (format = 'excel') => {
    if (!reportData.products || !Array.isArray(reportData.products)) {
      showError("No data available");
      return;
    }

    const lowStockProducts = reportData.products.filter(p => p.stock_quantity < 10);
    
    const headers = ["Product ID", "Name", "Current Stock", "Status", "Alert"];
    const rows = lowStockProducts.map(product => [
      product._id?.substring(0, 8) || 'N/A',
      product.name || 'N/A',
      product.stock_quantity || 0,
      formatStatus(product.status),
      formatStockStatus(product.stock_quantity),
    ]);

    if (format === 'pdf') {
      downloadPDF('Inventory Alert Report', headers, rows, 'inventory-report.pdf');
    } else {
      const csvContent = generateExcelContent(headers, rows);
      downloadCSV(csvContent, "inventory-report.xlsx");
    }
    // Success message now handled in download functions
  };

  const downloadCSV = (content, filename) => {
    try {
      // Parse the CSV content to create a worksheet
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      
      // Create worksheet data
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',');
        if (row.length === headers.length) {
          // Clean up the row data by removing quotes
          const cleanRow = row.map(cell => {
            // Remove surrounding quotes if present and unescape double quotes
            if (cell.startsWith('"') && cell.endsWith('"')) {
              return cell.substring(1, cell.length - 1).replace(/""/g, '"');
            }
            return cell;
          });
          data.push(cleanRow);
        }
      }
      
      // Create workbook and worksheet
      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      
      // Save the Excel file
      XLSX.writeFile(wb, filename);
      showSuccess('Excel report downloaded!');
    } catch (error) {
      console.error("Error generating Excel:", error);
      showError("Failed to generate Excel report");
    }
  };

  const downloadPDF = (title, headers, data, filename) => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      
      // Debugging: Check what methods are available on doc
      console.log("Available methods on doc:", Object.getOwnPropertyNames(Object.getPrototypeOf(doc)));
      console.log("autoTable exists:", typeof doc.autoTable);
      
      // Set document properties
      doc.setFontSize(18);
      doc.text(title, 40, 50);
      
      // Add date
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      doc.setFontSize(12);
      doc.text(`Generated on: ${dateStr}`, 40, 70);
      
      // Check if autoTable is available
      if (typeof doc.autoTable !== 'function') {
        // Try alternative approach
        if (typeof autoTable === 'function') {
          // Call autoTable directly with doc as first parameter
          autoTable(doc, {
            head: [headers],
            body: data,
            startY: 90,
            styles: {
              fontSize: 9,
              cellPadding: 5
            },
            headStyles: {
              fillColor: [74, 74, 74], // Dark gray
              textColor: [255, 255, 255], // White
              fontSize: 10
            },
            bodyStyles: {
              textColor: [0, 0, 0] // Black text
            },
            alternateRowStyles: {
              fillColor: [249, 249, 249] // Light gray
            },
            margin: { top: 90 },
            theme: 'grid'
          });
        } else {
          throw new Error('autoTable function is not available on jsPDF instance or as standalone function');
        }
      } else {
        // Add table with data using autotable
        doc.autoTable({
          head: [headers],
          body: data,
          startY: 90,
          styles: {
            fontSize: 9,
            cellPadding: 5
          },
          headStyles: {
            fillColor: [74, 74, 74], // Dark gray
            textColor: [255, 255, 255], // White
            fontSize: 10
          },
          bodyStyles: {
            textColor: [0, 0, 0] // Black text
          },
          alternateRowStyles: {
            fillColor: [249, 249, 249] // Light gray
          },
          margin: { top: 90 },
          theme: 'grid'
        });
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Report generated by Bakery Admin System • Page ${i} of ${pageCount}`, 40, doc.internal.pageSize.height - 20);
      }
      
      // Save the PDF
      doc.save(filename);
      showSuccess('PDF report downloaded!');
    } catch (error) {
      console.error("Error generating PDF:", error);
      showError("Failed to generate PDF report: " + error.message);
    }
  };

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format status with colors
  const formatStatus = (status) => {
    const statusMap = {
      'completed': 'Completed',
      'success': 'Success',
      'pending': 'Pending',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'active': 'Active',
      'inactive': 'Inactive'
    };
    return statusMap[status] || status;
  };

  // Format stock status
  const formatStockStatus = (stockQuantity) => {
    if (stockQuantity === 0) return 'Out of Stock';
    if (stockQuantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  // Format phone numbers
  const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    // Remove any non-digit characters and format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Format product names with truncation
  const formatProductName = (name, maxLength = 30) => {
    if (!name) return 'N/A';
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  // Format email addresses
  const formatEmail = (email) => {
    if (!email) return 'N/A';
    return email.toLowerCase();
  };

  // Format product names with truncation
  // Calculate report statistics
  const calculateReportStats = () => {
    const stats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      lowStockItems: 0
    };

    // Calculate total revenue
    if (Array.isArray(reportData.orders)) {
      stats.totalRevenue = reportData.orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      stats.totalOrders = reportData.orders.length;
    }

    // Count customers
    if (Array.isArray(reportData.customers)) {
      stats.totalCustomers = reportData.customers.length;
    }

    // Count products
    if (Array.isArray(reportData.products)) {
      stats.totalProducts = reportData.products.length;
      stats.lowStockItems = reportData.products.filter(p => p.stock_quantity < 10).length;
    }

    return stats;
  };

  // Get report statistics for display
  const reportStats = calculateReportStats();

  // Generate Excel content with better formatting
  const generateExcelContent = (headers, rows) => {
    // Use proper CSV formatting with quotes for text fields
    const escapeCell = (cell) => {
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    };
    
    const headerRow = headers.map(escapeCell).join(',');
    const dataRows = rows.map(row => 
      row.map(cell => escapeCell(cell)).join(',')
    ).join('\n');
    
    return `${headerRow}\n${dataRows}`;
  };

  const reportCards = [
    {
      title: "Sales Report",
      description: "Complete sales and order details",
      icon: <FaChartBar className="text-3xl text-pink-500" />,
      color: "bg-pink-50",
      count: Array.isArray(reportData.orders) ? reportData.orders.length : 0,
      actions: {
        excel: () => generateSalesReport('excel'),
        pdf: () => generateSalesReport('pdf'),
      },
    },
    {
      title: "Customer Report",
      description: "Customer list and activity",
      icon: <FaUsers className="text-3xl text-blue-500" />,
      color: "bg-blue-50",
      count: Array.isArray(reportData.customers) ? reportData.customers.length : 0,
      actions: {
        excel: () => generateCustomerReport('excel'),
        pdf: () => generateCustomerReport('pdf'),
      },
    },
    {
      title: "Product Report",
      description: "Product inventory and details",
      icon: <FaBoxOpen className="text-3xl text-green-500" />,
      color: "bg-green-50",
      count: Array.isArray(reportData.products) ? reportData.products.length : 0,
      actions: {
        excel: () => generateProductReport('excel'),
        pdf: () => generateProductReport('pdf'),
      },
    },
    {
      title: "Inventory Alert",
      description: "Low stock and out of stock items",
      icon: <FaShoppingCart className="text-3xl text-yellow-500" />,
      color: "bg-yellow-50",
      count: Array.isArray(reportData.products) ? reportData.products.filter(p => p.stock_quantity < 10).length : 0,
      actions: {
        excel: () => generateInventoryReport('excel'),
        pdf: () => generateInventoryReport('pdf'),
      },
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
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              "Refresh Data"
            )}
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
              <div className="flex gap-2">
                <button
                  onClick={report.actions.excel}
                  disabled={loading || report.count === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Download Excel"
                >
                  <FaFileExcel className="text-green-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={report.actions.pdf}
                  disabled={loading || report.count === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Download PDF"
                >
                  <FaFilePdf className="text-red-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(reportStats.totalRevenue)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportStats.totalOrders}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportStats.totalCustomers}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportStats.totalProducts}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-800">
                {reportStats.lowStockItems}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
