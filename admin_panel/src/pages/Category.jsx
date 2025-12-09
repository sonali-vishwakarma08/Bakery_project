// CategoriesPage.jsx
import React, { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import StatusToggle from "../components/StatusToggle";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/CategoryApi";
import { showSuccess, showError } from "../utils/toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editData, setEditData] = useState(null);

  const BASE_URL = "http://localhost:5000"; // replace with env if needed

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns
  const columns = [
    {
      header: "Image",
      accessor: "image",
      render: (row) =>
        row.image ? (
          <img
            src={`${BASE_URL}/uploads/categories/${row.image}`}
            alt={row.name}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    { header: "Category Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <StatusToggle
          status={row.status}
          onToggle={() => handleStatusToggle(row)}
        />
      ),
    },
  ];

  // Open add modal
  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  // Save (Add/Edit)
  const handleSave = async (formData) => {
    try {
      const dataToSend = new FormData();

      for (const key in formData) {
        if (key === "image" && formData[key] instanceof File) {
          dataToSend.append("image", formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      }

      if (editData?._id) {
        dataToSend.append("id", editData._id);
        await updateCategory(dataToSend);
      } else {
        await createCategory(dataToSend);
      }
      setModalOpen(false);
      fetchCategories();
      showSuccess("Category saved successfully!");
    } catch (err) {
      showError(err.message || "Error saving category");
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    try {
      if (editData?._id) {
        await deleteCategory(editData._id);
        showSuccess("Category deleted successfully!");
        setShowDelete(false);
        setEditData(null);
        fetchCategories();
      }
    } catch (err) {
      showError(err.message || "Failed to delete");
    }
  };

  // Toggle status
  const handleStatusToggle = async (category) => {
    try {
      const newStatus = category.status === "active" ? "inactive" : "active";
      const formData = new FormData();
      formData.append("id", category._id);
      formData.append("status", newStatus);

      await updateCategory(formData);
      showSuccess(
        `Category ${newStatus === "active" ? "activated" : "deactivated"} successfully!`
      );
      fetchCategories();
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  // Modal fields
  const fields = [
    { name: "name", label: "Category Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "image", label: "Image", type: "file" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  // Format date to show only date and time (YYYY-MM-DD HH:MM:SS)
  const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return "—";
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return "—";
    }
  };

  // Remove unwanted fields and format dates
  const getDisplayData = (data) => {
    if (!data) return {};
    
    // Remove __v, createdBy, created_by, CreatedBy, and any version fields
    const {
      __v: _v,
      v: _version,
      createdBy: _createdBy,
      created_by: _created_by,
      CreatedBy: _CreatedBy,
      ...rest
    } = data;
    
    // Format date fields (handle different naming conventions)
    const formatted = { ...rest };
    
    if (formatted.createdAt) {
      formatted.createdAt = formatDateTime(formatted.createdAt);
    }
    if (formatted.updatedAt) {
      formatted.updatedAt = formatDateTime(formatted.updatedAt);
    }
    if (formatted.CreatedAt) {
      formatted.CreatedAt = formatDateTime(formatted.CreatedAt);
    }
    if (formatted.UpdatedAt) {
      formatted.UpdatedAt = formatDateTime(formatted.UpdatedAt);
    }
    
    return formatted;
  };


  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <GenericTable
          title="Categories"
          columns={columns}
          data={categories}
          loading={loading}
          onAdd={handleAdd}
          onView={(row) => {
            setEditData(row);
            setShowView(true);
          }}
          onEdit={handleEdit}
          onDelete={(row) => {
            setEditData(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <AddEditModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSave={handleSave}
          title={editData ? "Edit Category" : "Add Category"}
          fields={fields}
          data={editData}
          imageFolder="categories"
        />
      )}

      {/* View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setEditData(null);
        }}
        title="Category Details"
        data={getDisplayData(editData)}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setEditData(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={editData?.name}
      />
    </div>
  );
}
