import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../api/orderApi";
import { showSuccess, showError } from "../utils/toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      showError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    { header: "Order Code", accessor: "order_code", render: (row) => row.order_code || `#${row._id?.slice(-6)}` },
    { 
      header: "Customer", 
      accessor: "user",
      render: (row) => row.user?.name || row.user?.email || "N/A"
    },
    { 
      header: "Total", 
      accessor: "final_amount",
      render: (row) => `₹${row.final_amount || row.total_amount || 0}`
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === "delivered" ? "bg-green-100 text-green-700" :
          row.status === "cancelled" ? "bg-red-100 text-red-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      header: "Date", 
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  // Handle status update
  const handleSave = async (formData) => {
    try {
      if (selectedOrder?._id && formData.status) {
        await updateOrderStatus(selectedOrder._id, formData.status);
        showSuccess("Order status updated successfully!");
        setShowAddEdit(false);
        fetchOrders();
      }
    } catch (err) {
      showError(err.message || "Failed to update order");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedOrder?._id) {
        await deleteOrder(selectedOrder._id);
        showSuccess("Order deleted successfully!");
        setShowDelete(false);
        fetchOrders();
      }
    } catch (err) {
      showError(err.message || "Failed to delete order");
    }
  };

  return (
      <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
      <GenericTable
        title="Orders"
        columns={columns}
        data={orders}
        loading={loading}
        onView={(row) => {
          setSelectedOrder(row);
          setShowView(true);
        }}
        onEdit={(row) => {
          setSelectedOrder(row);
          setShowAddEdit(true);
        }}
        onDelete={(row) => {
          setSelectedOrder(row);
          setShowDelete(true);
        }}
      />

      {/* ✅ Modals */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => setShowAddEdit(false)}
        title="Update Order Status"
        data={selectedOrder}
        fields={[
          { 
            label: "Status", 
            name: "status",
            type: "select",
            required: true,
            options: [
              { value: "pending", label: "Pending" },
              { value: "confirmed", label: "Confirmed" },
              { value: "baking", label: "Baking" },
              { value: "packed", label: "Packed" },
              { value: "out_for_delivery", label: "Out for Delivery" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]
          },
        ]}
        onSave={handleSave}
      />

      <ViewModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        title="View Order Details"
        data={selectedOrder || {}}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`Order #${selectedOrder?._id?.slice(-6)}`}
      />
      </div>
    </div>
  );
}
