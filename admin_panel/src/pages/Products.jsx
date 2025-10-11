import { useEffect, useState } from "react";
import axios from "axios";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import StatusToggle from "../components/StatusToggle";
import { showSuccess, showError } from "../utils/toast";

export default function ProductsPage() {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [editData, setEditData] = useState(null);

  const API_URL = "http://localhost:5000/api";

  // ✅ Fetch all categories and subcategories
  useEffect(() => {
    axios
      .get(`${API_URL}/categories/all`)
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));

    axios
      .get(`${API_URL}/subcategories/all`)
      .then((res) => {
        setSubCategories(res.data || []);
      })
      .catch((err) => console.error("Error fetching subcategories:", err));
  }, []);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products/all`);
      setData(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Modal form fields
  const fields = [
    { label: "Product Name", name: "name", type: "text", required: true },
    { label: "Price (₹)", name: "price", type: "number", required: true },
    {
      label: "Category",
      name: "category",
      type: "select",
      options: categories.map((cat) => ({
        label: cat.name,
        value: cat._id,
      })),
    },
    {
      label: "SubCategory",
      name: "subcategory",
      type: "select",
      required: true,
      options: subCategories.map((subCat) => ({
        label: subCat.name,
        value: subCat._id,
      })),
    },
    { label: "Stock", name: "stock_quantity", type: "number", required: true },
    { label: "Image", name: "image", type: "file" },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      label: "Featured",
      name: "is_featured",
      type: "select",
      options: [
        { label: "No", value: "false" },
        { label: "Yes", value: "true" },
      ],
    },
    { label: "Description", name: "description", type: "textarea" },
  ];

  // ✅ Handle Save (Add / Update)
  const handleSave = async (formData) => {
    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        if (key === "image" && formData[key] instanceof File && formData[key].name)
          dataToSend.append("image", formData[key]);
        else dataToSend.append(key, formData[key]);
      }

      const token = localStorage.getItem("token");

      if (editData) {
        dataToSend.append("id", editData._id);
        await axios.post(`${API_URL}/products/update`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showSuccess("Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/products/create`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        showSuccess("Product added successfully!");
      }

      setModalOpen(false);
      setEditData(null);
      fetchProducts();
    } catch (err) {
      console.error("Save Error:", err);
      showError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  // ✅ Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/products/delete`,
        { id: editData._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showSuccess("Product deleted successfully!");
      setShowDelete(false);
      setEditData(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      showError(err.response?.data?.message || "Failed to delete product");
    }
  };

  // ✅ Handle Status Toggle
  const handleStatusToggle = async (product) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = product.status === "active" ? "inactive" : "active";
      
      await axios.post(
        `${API_URL}/products/update`,
        { id: product._id, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      showSuccess(`Product ${newStatus === "active" ? "activated" : "deactivated"} successfully!`);
      fetchProducts();
    } catch (err) {
      console.error("Status Toggle Error:", err);
      showError(err.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ Columns for product table
  const columns = [
    {
      header: "Image",
      accessor: "images",
      render: (row) =>
        row.images && row.images.length > 0 ? (
          <img
            src={`http://localhost:5000/uploads/products/${row.images[0]}`}
            alt={row.name}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        ),
    },
    { header: "Product Name", accessor: "name" },
    {
      header: "Category",
      accessor: "category.name",
      render: (row) => row.category?.name || "—",
    },
    {
      header: "SubCategory",
      accessor: "subcategory.name",
      render: (row) => row.subcategory?.name || "—",
    },
    {
      header: "Price",
      accessor: "price",
      render: (row) =>
        row.price !== undefined && row.price !== null ? `₹${row.price}` : "₹0",
    },
    { header: "Stock", accessor: "stock_quantity" },
    {
      header: "Featured",
      accessor: "is_featured",
      render: (row) => (row.is_featured ? "Yes" : "No"),
    },
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

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <GenericTable
          title="Products"
          columns={columns}
          data={data}
          onAdd={() => {
            setEditData(null);
            setModalOpen(true);
          }}
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

      {/* ✅ Add/Edit Modal */}
      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        title={editData ? "Edit Product" : "Add Product"}
        fields={fields}
        data={editData}
      />

      {/* ✅ View Modal */}
      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setEditData(null);
        }}
        title="Product Details"
        data={editData || {}}
      />

      {/* ✅ Delete Modal */}
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
