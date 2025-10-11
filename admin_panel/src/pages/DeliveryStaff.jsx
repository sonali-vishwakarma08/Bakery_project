import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import StatusToggle from "../components/StatusToggle";
import { showSuccess, showError } from "../utils/toast";
import { getDeliveryStaff, createDeliveryStaff, updateDeliveryStaff, deleteDeliveryStaff } from "../api/deliveryStaffApi";
import axios from "axios";

export default function DeliveryStaffPage() {
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch delivery staff
  const fetchDeliveryStaff = async () => {
    try {
      setLoading(true);
      const data = await getDeliveryStaff();
      setDeliveryStaff(data);
    } catch (err) {
      console.error("Failed to load delivery staff:", err);
      showError(err.message || "Failed to load delivery staff");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders for dropdown
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/orders/all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    fetchDeliveryStaff();
    fetchOrders();
  }, []);

  // Columns for table
  const columns = [
    { header: "Order ID", accessor: "order.order_code", render: (row) => row.order?.order_code || "—" },
    { header: "Provider", accessor: "provider" },
    { header: "Tracking ID", accessor: "tracking_id", render: (row) => row.tracking_id || "—" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <StatusToggle
          status={row.status === 'delivered' ? 'active' : 'inactive'}
          onToggle={() => handleStatusToggle(row)}
        />
      )
    },
    { 
      header: "Delivery Fee", 
      accessor: "delivery_fee",
      render: (row) => `₹${row.delivery_fee || 0}`
    },
    { 
      header: "Expected Delivery", 
      accessor: "expected_delivery_time",
      render: (row) => row.expected_delivery_time 
        ? new Date(row.expected_delivery_time).toLocaleDateString() 
        : "—"
    },
  ];

  // Form fields
  const fields = [
    { 
      label: "Order", 
      name: "order", 
      type: "select",
      required: true,
      options: orders.map((order) => ({
        label: `${order.order_code} - ₹${order.total_amount}`,
        value: order._id,
      })),
    },
    { label: "Provider", name: "provider", type: "text", required: true, placeholder: "e.g., Dunzo, ShipRocket" },
    { label: "Tracking ID", name: "tracking_id", type: "text", placeholder: "Optional" },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Picked", value: "picked" },
        { label: "In Transit", value: "in_transit" },
        { label: "Delivered", value: "delivered" },
        { label: "Failed", value: "failed" },
      ],
    },
    { label: "Delivery Fee (₹)", name: "delivery_fee", type: "number", placeholder: "0" },
    { label: "Expected Delivery", name: "expected_delivery_time", type: "datetime-local" },
    { label: "Notes", name: "notes", type: "textarea", placeholder: "Optional notes" },
  ];

  // Handle Save
  const handleSave = async (formData) => {
    try {
      if (editData) {
        await updateDeliveryStaff({ ...formData, id: editData._id });
        showSuccess("Delivery updated successfully!");
      } else {
        await createDeliveryStaff(formData);
        showSuccess("Delivery created successfully!");
      }
      setModalOpen(false);
      setEditData(null);
      fetchDeliveryStaff();
    } catch (err) {
      showError(err.message || "Failed to save delivery");
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    try {
      await deleteDeliveryStaff(editData._id);
      showSuccess("Delivery deleted successfully!");
      setShowDelete(false);
      setEditData(null);
      fetchDeliveryStaff();
    } catch (err) {
      showError(err.message || "Failed to delete delivery");
    }
  };

  // Handle Status Toggle
  const handleStatusToggle = async (delivery) => {
    try {
      const newStatus = delivery.status === "delivered" ? "pending" : "delivered";
      await updateDeliveryStaff({ id: delivery._id, status: newStatus });
      showSuccess(`Delivery status updated to ${newStatus}!`);
      fetchDeliveryStaff();
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <GenericTable
          title="Delivery Staff"
          columns={columns}
          data={deliveryStaff}
          loading={loading}
          onAdd={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          onView={(row) => {
            setEditData(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setEditData(row);
            setModalOpen(true);
          }}
          onDelete={(row) => {
            setEditData(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <AddEditModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        title={editData ? "Edit Delivery" : "Add Delivery"}
        fields={fields}
        data={editData}
      />

      {/* View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setEditData(null);
        }}
        title="Delivery Details"
        data={editData || {}}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setEditData(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={editData?.tracking_id || "this delivery"}
      />
    </div>
  );
}
