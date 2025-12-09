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
    { header: "Order Code", accessor: "order.order_code", render: (row) => row.order?.order_code || "—" },
    { header: "Rider Name", accessor: "rider_name", render: (row) => row.rider_name || "—" },
    { header: "Rider Phone", accessor: "rider_phone", render: (row) => row.rider_phone || "—" },
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
      header: "Created", 
      accessor: "createdAt",
      render: (row) => row.createdAt 
        ? new Date(row.createdAt).toLocaleDateString() 
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
        label: `${order.order_code || order._id} - ₹${order.final_amount || order.total_amount || 0}`,
        value: order._id,
      })),
    },
    { label: "Rider Name", name: "rider_name", type: "text", placeholder: "Optional" },
    { label: "Rider Phone", name: "rider_phone", type: "text", placeholder: "Optional" },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Baking", value: "baking" },
        { label: "Packed", value: "packed" },
        { label: "Out for Delivery", value: "out_for_delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
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
      const statusOrder = ['pending', 'baking', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];
      const currentIndex = statusOrder.indexOf(delivery.status);
      const nextIndex = currentIndex < statusOrder.length - 1 ? currentIndex + 1 : 0;
      const newStatus = statusOrder[nextIndex];
      
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
        itemName={editData?.order?.order_code || "this delivery"}
      />
    </div>
  );
}
