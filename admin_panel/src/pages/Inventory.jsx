import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { getAllInventories, addInventory, updateInventory, restockInventory, deleteInventory } from "../api/inventoryApi";
import { showSuccess, showError } from "../utils/toast";

export default function Inventory() {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showRestock, setShowRestock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch inventories from backend
  const fetchInventories = async () => {
    try {
      setLoading(true);
      const data = await getAllInventories();
      setInventories(data || []);
    } catch (err) {
      console.error("Failed to load inventories:", err);
      showError(err.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  const columns = [
    { header: "Item Name", accessor: "name" },
    { 
      header: "Quantity Available", 
      accessor: "quantity_available",
      render: (row) => (
        <span className={`font-semibold ${
          row.quantity_available === 0 ? "text-red-600" : "text-green-600"
        }`}>
          {row.quantity_available} {row.unit}
        </span>
      )
    },
    { 
      header: "Unit", 
      accessor: "unit",
      render: (row) => row.unit?.toUpperCase() || "N/A"
    },
    { 
      header: "Status", 
      accessor: "quantity_available",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.quantity_available === 0 ? "bg-red-100 text-red-700" :
          "bg-green-100 text-green-700"
        }`}>
          {row.quantity_available === 0 ? "Out of Stock" : "In Stock"}
        </span>
      )
    },
  ];

  // Handle save (create/update)
  const handleSave = async (formData) => {
    try {
      if (selectedItem?._id) {
        await updateInventory({ id: selectedItem._id, ...formData });
        showSuccess("Inventory updated successfully!");
      } else {
        await addInventory(formData);
        showSuccess("Inventory item added successfully!");
      }
      setShowAddEdit(false);
      setSelectedItem(null);
      fetchInventories();
    } catch (err) {
      showError(err.message || "Failed to save inventory");
    }
  };

  // Handle restock
  const handleRestock = async (formData) => {
    try {
      if (selectedItem?._id && formData.quantity) {
        await restockInventory(selectedItem._id, formData.quantity);
        showSuccess("Inventory restocked successfully!");
        setShowRestock(false);
        setSelectedItem(null);
        fetchInventories();
      }
    } catch (err) {
      showError(err.message || "Failed to restock inventory");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedItem?._id) {
        await deleteInventory(selectedItem._id);
        showSuccess("Inventory item deleted successfully!");
        setShowDelete(false);
        setSelectedItem(null);
        fetchInventories();
      }
    } catch (err) {
      showError(err.message || "Failed to delete inventory");
    }
  };

  const fields = [
    { label: "Item Name", name: "name", type: "text", required: true },
    { label: "Quantity Available", name: "quantity_available", type: "number", required: true, min: 0 },
    { 
      label: "Unit", 
      name: "unit", 
      type: "select",
      required: true,
      options: [
        { value: "kg", label: "Kilogram (kg)" },
        { value: "ltr", label: "Liter (ltr)" },
        { value: "pcs", label: "Pieces (pcs)" },
      ]
    },
  ];

  const restockFields = [
    { label: "Quantity to Add", name: "quantity", type: "number", required: true },
  ];

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Inventory Management"
          columns={columns}
          data={inventories}
          loading={loading}
          onAdd={() => {
            setSelectedItem(null);
            setShowAddEdit(true);
          }}
          onEdit={(row) => {
            setSelectedItem(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedItem(row);
            setShowDelete(true);
          }}
          customActions={[
            {
              label: "Restock",
              icon: "📦",
              onClick: (row) => {
                setSelectedItem(row);
                setShowRestock(true);
              },
            },
          ]}
        />
      </div>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? "Edit Inventory Item" : "Add Inventory Item"}
        data={selectedItem}
        fields={fields}
        onSave={handleSave}
      />

      {/* ✅ Restock Modal */}
      <AddEditModal
        isOpen={showRestock}
        onClose={() => {
          setShowRestock(false);
          setSelectedItem(null);
        }}
        title={`Restock: ${selectedItem?.name}`}
        data={{}}
        fields={restockFields}
        onSave={handleRestock}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.name}
      />
    </div>
  );
}
