import API from "./api";

// Helper to convert arrays to comma-separated string
const normalizeField = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
};

// ✅ Fetch all products
export const getProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.get("/products/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message || "Failed to fetch products" };
  }
};

// ✅ Create new product (supports image upload)
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    for (const key in productData) {
      if (key === "images" && productData[key]) {
        for (const file of productData[key]) formData.append("images", file);
      } else if (key === "weight_options" || key === "flavors") {
        formData.append(key, normalizeField(productData[key]));
      } else {
        formData.append(key, productData[key]);
      }
    }

    const res = await API.post("/products/create", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create product" };
  }
};

// ✅ Update existing product (supports image upload)
// Update existing product (supports image upload)
export const updateProduct = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    // formData is already a FormData object with 'id' included
    const res = await API.post("/products/update", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update product" };
  }
};


// ✅ Delete product by ID
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(
      "/products/delete",
      { id: productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete product" };
  }
};
