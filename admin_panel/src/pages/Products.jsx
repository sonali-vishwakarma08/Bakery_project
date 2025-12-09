import { useState, useEffect } from "react";
import GenericTable from "../table/GenericTable";
import AddEditModal from "../Modals/AddEditModal";
import ViewModal from "../Modals/ViewModal";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import StatusToggle from "../components/StatusToggle";
import { showSuccess, showError } from "../utils/toast";
import { getCategories } from "../api/CategoryApi";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const BASE_URL = "http://localhost:5000";

  // Fetch categories
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

  // Fetch products
  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const productsData = Array.isArray(response) ? response : response?.products || [];
      setProducts(productsData);
    } catch (err) {
      console.error("Fetch products error:", err);
      showError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(
      2,
      "0"
    )} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(
      d.getSeconds()
    ).padStart(2, "0")}`;
  };

  const getDisplayData = (data) => {
    if (!data) return {};
    const { _id, __v, CreatedBy, ...rest } = data;
    return {
      ...rest,
      _id: data._id,
      CreatedAt: formatDateTime(data.CreatedAt),
      UpdatedAt: formatDateTime(data.UpdatedAt),
      image:
        data.images?.[0] && data.images[0].startsWith("http")
          ? data.images[0]
          : data.images?.[0]
          ? `${BASE_URL}/uploads/products/${data.images[0]}`
          : null,
      category: data.category?._id || data.category || null,
      subcategory: data.subcategory?._id || data.subcategory || null,
      weight_options: Array.isArray(data.weight_options)
        ? data.weight_options
        : typeof data.weight_options === "string"
        ? data.weight_options.split(",").map((v) => v.trim())
        : [],
      flavors: Array.isArray(data.flavors)
        ? data.flavors
        : typeof data.flavors === "string"
        ? data.flavors.split(",").map((v) => v.trim())
        : [],
    };
  };

  const columns = [
    {
      header: "Image",
      accessor: "images",
      render: (row) => {
        const imageSrc = row.images?.[0]
          ? row.images[0].startsWith("http")
            ? row.images[0]
            : `${BASE_URL}/uploads/products/${row.images[0]}`
          : "https://via.placeholder.com/48?text=No+Image";
        return (
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <img
              src={imageSrc}
              alt={row.name || "Product"}
              className="max-w-full max-h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/48?text=Error";
              }}
            />
          </div>
        );
      },
    },
    { header: "Product Name", accessor: "name", render: (row) => row.name || "—" },
    {
      header: "Category",
      accessor: "category",
      render: (row) => row.category?.name || (typeof row.category === "string" ? row.category : "—"),
    },
    {
      header: "Subcategory",
      accessor: "subcategory",
      render: (row) => row.subcategory?.name || (typeof row.subcategory === "string" ? row.subcategory : "—"),
    },
    {
      header: "Weight Options",
      accessor: "weight_options",
      render: (row) =>
        Array.isArray(row.weight_options) && row.weight_options.length ? row.weight_options.join(", ") : "—",
    },
    {
      header: "Flavors",
      accessor: "flavors",
      render: (row) => (Array.isArray(row.flavors) && row.flavors.length ? row.flavors.join(", ") : "—"),
    },
    { header: "Price (₹)", accessor: "price", render: (row) => (row.price ? `₹${row.price}` : "—") },
    { header: "Stock", accessor: "stock_quantity", render: (row) => row.stock_quantity ?? "—" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusToggle status={row.status} onToggle={() => handleStatusToggle(row)} />,
    },
  ];

  const fields = [
    { label: "Product Name", name: "name", type: "text", required: true, placeholder: "Enter product name" },
    {
      label: "Category",
      name: "category",
      type: "select",
      required: true,
      options: categories.map((cat) => ({ label: cat.name, value: cat._id })),
      placeholder: "Select category",
    },
    {
      label: "Subcategory",
      name: "subcategory",
      type: "select",
      options:
        categories
          .find((c) => c._id === selectedProduct?.category)
          ?.subcategories?.map((sc) => ({ label: sc.name, value: sc._id })) || [],
      placeholder: "Select subcategory",
    },
    { label: "Price (₹)", name: "price", type: "number", required: true, min: 0, step: 0.01, placeholder: "Enter price" },
    { label: "Stock Quantity", name: "stock_quantity", type: "number", required: true, min: 0, placeholder: "Enter stock quantity" },
    { label: "Weight Options", name: "weight_options", type: "text", placeholder: "Comma-separated weights" },
    { label: "Flavors", name: "flavors", type: "text", placeholder: "Comma-separated flavors" },
    { label: "Product Images", name: "images", type: "file", multiple: true, accept: "image/*" },
    { label: "Description", name: "description", type: "textarea", placeholder: "Enter description", rows: 3 },
    {
      label: "Status",
      name: "status",
      type: "select",
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      defaultValue: "active",
    },
  ];

  const handleSave = async (formData) => {
  try {
    const dataToSend = new FormData();

    for (const key in formData) {
      if (key === "images") {
        const files = Array.isArray(formData.images) ? formData.images : [formData.images];
        files.forEach((file) => dataToSend.append("images", file));
      } else if (key === "weight_options" || key === "flavors") {
        const value = Array.isArray(formData[key])
          ? formData[key]
          : typeof formData[key] === "string"
          ? formData[key].split(",").map((v) => v.trim())
          : [];
        dataToSend.append(key, JSON.stringify(value)); // <-- important
      } else if (formData[key] !== undefined && formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    }

    // Append ID if editing
    if (selectedProduct?._id) {
      dataToSend.append("id", selectedProduct._id); // <-- ensure ID is sent
      await updateProduct(dataToSend);
      showSuccess("Product updated successfully!");
    } else {
      await createProduct(dataToSend);
      showSuccess("Product created successfully!");
    }

    setShowAddEdit(false);
    setSelectedProduct(null);
    fetchProductsList();
  } catch (err) {
    console.error("Save product error:", err);
    showError(err.response?.data?.message || err.message || "Failed to save product");
  }
};


  const handleDeleteConfirm = async () => {
    try {
      if (selectedProduct?._id) {
        await deleteProduct(selectedProduct._id);
        showSuccess("Product deleted successfully!");
        setShowDelete(false);
        setSelectedProduct(null);
        fetchProductsList();
      }
    } catch (err) {
      showError(err.message || "Failed to delete product");
    }
  };

  const handleStatusToggle = async (product) => {
    try {
      const newStatus = product.status === "active" ? "inactive" : "active";
      const formData = new FormData();
      formData.append("id", product._id);
      formData.append("status", newStatus);
      await updateProduct(formData);
      showSuccess(`Product ${newStatus} successfully!`);
      fetchProductsList();
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-3">
        <GenericTable
          title="Products"
          columns={columns}
          data={products}
          loading={loading}
          onAdd={() => {
            setSelectedProduct(null);
            setShowAddEdit(true);
          }}
          onView={(row) => {
            setSelectedProduct(getDisplayData(row));
            setShowView(true);
          }}
          onEdit={(row) => {
            setSelectedProduct(getDisplayData(row));
            setShowAddEdit(true);
          }}
          onDelete={(row) => {
            setSelectedProduct(getDisplayData(row));
            setShowDelete(true);
          }}
        />
      </div>

      <AddEditModal
        isOpen={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? "Edit Product" : "Add Product"}
        data={selectedProduct}
        fields={fields}
        onSave={handleSave}
        imageFolder="products"
      />

      <ViewModal
        isOpen={showView}
        onClose={() => {
          setShowView(false);
          setSelectedProduct(null);
        }}
        title="Product Details"
        data={selectedProduct || {}}
        apiBaseUrl={BASE_URL}
      />

      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedProduct?.name}
      />
    </div>
  );
}
