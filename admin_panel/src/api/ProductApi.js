import API from "./api";

// ✅ Fetch all products
export const getProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post(
      "/products/all",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

// ✅ Create new product (supports image upload)
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");

    // Build FormData for multipart upload
    const formData = new FormData();
    for (const key in productData) {
      if (key === "images") {
        // handle multiple images
        for (const file of productData.images) {
          formData.append("images", file);
        }
      } else {
        formData.append(key, productData[key]);
      }
    }

    const res = await API.post("/products/create", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create product" };
  }
};

// ✅ Update existing product (supports image upload)
export const updateProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    for (const key in productData) {
      if (key === "images") {
        for (const file of productData.images) {
          formData.append("images", file);
        }
      } else {
        formData.append(key, productData[key]);
      }
    }

    const res = await API.post("/products/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete product" };
  }
};
