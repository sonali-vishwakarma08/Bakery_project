import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../api/couponApi";
import { showSuccess, showError } from "../utils/toast";

export default function PromocodePage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error("Failed to load coupons:", err);
      showError(err.message || "Failed to fetch promocodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const columns = [
    { header: "Code", accessor: "code" },
    { 
      header: "Discount", 
      accessor: "discount_value",
      render: (row) => row.discount_type === "percentage" 
        ? `${row.discount_value}%` 
        : `₹${row.discount_value}`
    },
    { 
      header: "Type", 
      accessor: "discount_type",
      render: (row) => row.discount_type === "percentage" ? "Percentage" : "Fixed"
    },
    { 
      header: "Status", 
      accessor: "is_active",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    { 
      header: "Expiry", 
      accessor: "expiry_date",
      render: (row) => row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : "No Expiry"
    },
  ];

  // Handle save (create/update)
  const handleSave = async (formData) => {
    try {
      if (selectedCoupon?._id) {
        await updateCoupon({ id: selectedCoupon._id, ...formData });
        showSuccess("Promocode updated successfully!");
      } else {
        await createCoupon(formData);
        showSuccess("Promocode created successfully!");
      }
      setShowAddEdit(false);
      setSelectedCoupon(null);
      fetchCoupons();
    } catch (err) {
      showError(err.message || "Failed to save promocode");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedCoupon?._id) {
        await deleteCoupon(selectedCoupon._id);
        showSuccess("Promocode deleted successfully!");
        setShowDelete(false);
        setSelectedCoupon(null);
        fetchCoupons();
      }
    } catch (err) {
      showError(err.message || "Failed to delete promocode");
    }
  };

  const fields = [
    { label: "Coupon Code", name: "code", type: "text", required: true },
    { 
      label: "Discount Type", 
      name: "discount_type", 
      type: "select",
      required: true,
      options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed Amount" },
      ]
    },
    { label: "Discount Value", name: "discount_value", type: "number", required: true },
    { label: "Minimum Order Amount", name: "min_order_amount", type: "number" },
    { label: "Max Uses", name: "max_uses", type: "number" },
    { label: "Expiry Date", name: "expiry_date", type: "date" },
    { 
      label: "Status", 
      name: "is_active", 
      type: "select",
      options: [
        { value: true, label: "Active" },
        { value: false, label: "Inactive" },
      ]
    },
  ];

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Promocodes"
          columns={columns}
          data={coupons}
          loading={loading}
          onAdd={() => {
            setSelectedCoupon(null);
            setShowAddEdit(true);
          }}
          onEdit={(row) => {
            setSelectedCoupon(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedCoupon(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedCoupon(null);
        }}
        title={selectedCoupon ? "Edit Promocode" : "Add Promocode"}
        data={selectedCoupon}
        fields={fields}
        onSave={handleSave}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedCoupon(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCoupon?.code}
      />
    </div>
  );
}
