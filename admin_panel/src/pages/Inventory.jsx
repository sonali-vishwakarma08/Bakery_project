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
    { header: "Item Name", accessor: "item_name" },
    { 
      header: "Category", 
      accessor: "category",
      render: (row) => row.category || "N/A"
    },
    { 
      header: "Quantity", 
      accessor: "quantity",
      render: (row) => (
        <span className={`font-semibold ${
          row.quantity < row.min_stock_level ? "text-red-600" : "text-green-600"
        }`}>
          {row.quantity} {row.unit}
        </span>
      )
    },
    { 
      header: "Min Stock", 
      accessor: "min_stock_level",
      render: (row) => `${row.min_stock_level} ${row.unit}`
    },
    { 
      header: "Status", 
      accessor: "quantity",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.quantity === 0 ? "bg-red-100 text-red-700" :
          row.quantity < row.min_stock_level ? "bg-yellow-100 text-yellow-700" :
          "bg-green-100 text-green-700"
        }`}>
          {row.quantity === 0 ? "Out of Stock" :
           row.quantity < row.min_stock_level ? "Low Stock" : "In Stock"}
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
    { label: "Item Name", name: "item_name", type: "text", required: true },
    { label: "Category", name: "category", type: "text" },
    { label: "Quantity", name: "quantity", type: "number", required: true },
    { label: "Unit", name: "unit", type: "text", required: true },
    { label: "Min Stock Level", name: "min_stock_level", type: "number", required: true },
    { label: "Supplier", name: "supplier", type: "text" },
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
        title={`Restock: ${selectedItem?.item_name}`}
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
        itemName={selectedItem?.item_name}
      />
    </div>
  );
}
