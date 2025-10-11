import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import StatusToggle from "../components/StatusToggle";
import { showSuccess, showError } from "../utils/toast";
import { getSubCategories, createSubCategory, updateSubCategory, deleteSubCategory } from "../api/subCategoryApi";
import { getCategories } from "../api/CategoryApi";

export default function SubCategory() {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const data = await getSubCategories();
      setSubCategories(data || []);
    } catch (err) {
      console.error("Failed to load subcategories:", err);
      showError(err.message || "Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const columns = [
    {
      header: "Image",
      accessor: "image",
      render: (row) =>
        row.image ? (
          <img
            src={`http://localhost:5000/uploads/subcategories/${row.image}`}
            alt={row.name}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    { header: "Subcategory Name", accessor: "name" },
    { 
      header: "Parent Category", 
      accessor: "category.name",
      render: (row) => row.category?.name || "—"
    },
    { header: "Description", accessor: "description" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <StatusToggle
          status={row.status}
          onToggle={() => handleStatusToggle(row)}
        />
      )
    },
  ];

  const fields = [
    { label: "Subcategory Name", name: "name", type: "text", required: true },
    { 
      label: "Parent Category", 
      name: "category", 
      type: "select",
      required: true,
      options: categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }))
    },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Image", name: "image", type: "file" },
    { 
      label: "Status", 
      name: "status", 
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]
    },
  ];

  // Handle save (create/update)
  const handleSave = async (formData) => {
    try {
      const dataToSend = new FormData();
      
      // Add all form fields to FormData
      for (const key in formData) {
        if (key === "image" && formData[key] instanceof File) {
          dataToSend.append("image", formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      }
      
      if (selectedSubCategory?._id) {
        dataToSend.append("id", selectedSubCategory._id);
        await updateSubCategory(dataToSend);
        showSuccess("Subcategory updated successfully!");
      } else {
        await createSubCategory(dataToSend);
        showSuccess("Subcategory created successfully!");
      }
      setShowAddEdit(false);
      setSelectedSubCategory(null);
      fetchSubCategories();
    } catch (err) {
      showError(err.message || "Failed to save subcategory");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedSubCategory?._id) {
        await deleteSubCategory(selectedSubCategory._id);
        showSuccess("Subcategory deleted successfully!");
        setShowDelete(false);
        setSelectedSubCategory(null);
        fetchSubCategories();
      }
    } catch (err) {
      showError(err.message || "Failed to delete subcategory");
    }
  };

  // Handle Status Toggle
  const handleStatusToggle = async (subcategory) => {
    try {
      const newStatus = subcategory.status === "active" ? "inactive" : "active";
      const formData = new FormData();
      formData.append("id", subcategory._id);
      formData.append("status", newStatus);
      
      await updateSubCategory(formData);
      showSuccess(`Subcategory ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
      fetchSubCategories();
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable 
          title="Subcategories" 
          columns={columns} 
          data={subCategories}
          onAdd={() => {
            setSelectedSubCategory(null);
            setShowAddEdit(true);
          }}
          onView={(row) => {
            setSelectedSubCategory(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedSubCategory(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedSubCategory(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedSubCategory(null);
        }}
        title={selectedSubCategory ? "Edit Subcategory" : "Add Subcategory"}
        data={selectedSubCategory}
        fields={fields}
        onSave={handleSave}
      />

      {/* ✅ View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedSubCategory(null);
        }}
        title="Subcategory Details"
        data={selectedSubCategory || {}}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedSubCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedSubCategory?.name}
      />
    </div>
  );
}
