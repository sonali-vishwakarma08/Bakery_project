import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import ViewModal from "../Modals/ViewModal";
import AddEditModal from "../Modals/AddEditModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { getAllPayments, updatePayment, deletePayment } from "../api/paymentApi";
import { showSuccess, showError } from "../utils/toast";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch payments from backend
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data || []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      showError(err.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    { header: "Payment ID", accessor: "_id", render: (row) => `#${row._id?.slice(-6)}` },
    { 
      header: "Order ID", 
      accessor: "order",
      render: (row) => row.order?._id ? `#${row.order._id.slice(-6)}` : "N/A"
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => `₹${row.amount || 0}`
    },
    { 
      header: "Method", 
      accessor: "payment_method",
      render: (row) => row.payment_method || "N/A"
    },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === "completed" ? "bg-green-100 text-green-700" :
          row.status === "failed" ? "bg-red-100 text-red-700" :
          "bg-yellow-100 text-yellow-700"
        }`}>
          {row.status || "pending"}
        </span>
      )
    },
    { 
      header: "Date", 
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  // Handle update
  const handleSave = async (formData) => {
    try {
      if (selectedPayment?._id) {
        await updatePayment({ id: selectedPayment._id, ...formData });
        showSuccess("Payment updated successfully!");
        setShowEdit(false);
        fetchPayments();
      }
    } catch (err) {
      showError(err.message || "Failed to update payment");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedPayment?._id) {
        await deletePayment(selectedPayment._id);
        showSuccess("Payment deleted successfully!");
        setShowDelete(false);
        fetchPayments();
      }
    } catch (err) {
      showError(err.message || "Failed to delete payment");
    }
  };

  return (
 <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Payments"
          columns={columns}
          data={payments}
          loading={loading}
          onView={(row) => {
            setSelectedPayment(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedPayment(row);
            setShowEdit(true);
          }}
          onDelete={(row) => {
            setSelectedPayment(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        title="Payment Details"
        data={selectedPayment || {}}
      />

      {/* ✅ Edit Modal */}
      <AddEditModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Update Payment Status"
        data={selectedPayment}
        fields={[
          { 
            label: "Status", 
            name: "status",
            type: "select",
            required: true,
            options: [
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" },
              { value: "failed", label: "Failed" },
              { value: "refunded", label: "Refunded" },
            ]
          },
        ]}
        onSave={handleSave}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`Payment #${selectedPayment?._id?.slice(-6)}`}
      />
    </div>
  );
}
