import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import { showSuccess, showError } from "../utils/toast";
import { getBanners, createBanner, updateBanner, deleteBanner } from "../api/bannerApi";

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getBanners();
      setBanners(data || []);
    } catch (err) {
      console.error("Failed to load banners:", err);
      showError(err.message || "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const columns = [
    {
      header: "Image",
      accessor: "image",
      render: (row) =>
        row.image ? (
          <img
            src={`http://localhost:5000/uploads/banners/${row.image}`}
            alt={row.title}
            className="w-20 h-12 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    { header: "Title", accessor: "title" },
    { header: "Link", accessor: "link" },
    { 
      header: "Status", 
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${
          row.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {row.status === "active" ? "Active" : "Inactive"}
        </span>
      )
    },
  ];

  const fields = [
    { label: "Title", name: "title", type: "text", required: true },
    { label: "Link", name: "link", type: "text" },
    { label: "Image", name: "image", type: "file", required: true },
    { label: "Display Order", name: "displayOrder", type: "number" },
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
      
      if (selectedBanner?._id) {
        dataToSend.append("id", selectedBanner._id);
        await updateBanner(dataToSend);
        showSuccess("Banner updated successfully!");
      } else {
        await createBanner(dataToSend);
        showSuccess("Banner created successfully!");
      }
      setShowAddEdit(false);
      setSelectedBanner(null);
      fetchBanners();
    } catch (err) {
      showError(err.message || "Failed to save banner");
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    try {
      if (selectedBanner?._id) {
        await deleteBanner(selectedBanner._id);
        showSuccess("Banner deleted successfully!");
        setShowDelete(false);
        setSelectedBanner(null);
        fetchBanners();
      }
    } catch (err) {
      showError(err.message || "Failed to delete banner");
    }
  };

  return (
    <div className="p-1">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Banners"
          columns={columns}
          data={banners}
          onAdd={() => {
            setSelectedBanner(null);
            setShowAddEdit(true);
          }}
          onView={(row) => {
            setSelectedBanner(row);
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedBanner(row);
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedBanner(row);
            setShowDelete(true);
          }}
        />
      </div>

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedBanner(null);
        }}
        title={selectedBanner ? "Edit Banner" : "Add Banner"}
        data={selectedBanner}
        fields={fields}
        onSave={handleSave}
      />

      {/* ✅ View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedBanner(null);
        }}
        title="Banner Details"
        data={selectedBanner || {}}
      />

      {/* ✅ Delete Modal */}
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedBanner(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedBanner?.title}
      />
    </div>
  );
}
