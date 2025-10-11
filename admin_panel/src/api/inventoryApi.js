import API from "./api";

// Get all inventories
export const getAllInventories = async (filters = {}) => {
  try {
    const res = await API.post("/inventory/all", filters);
    return res.data;
  } catch (error) {
    console.error("Error fetching inventories:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch inventories" };
  }
};

// Get single inventory by ID
export const getInventoryById = async (inventoryId) => {
  try {
    const res = await API.post("/inventory/single", { id: inventoryId });
    return res.data;
  } catch (error) {
    console.error("Error fetching inventory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch inventory" };
  }
};

// Add new inventory (Admin only)
export const addInventory = async (inventoryData) => {
  try {
    const res = await API.post("/inventory/add", inventoryData);
    return res.data;
  } catch (error) {
    console.error("Error adding inventory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to add inventory" };
  }
};

// Update inventory (Admin only)
export const updateInventory = async (inventoryData) => {
  try {
    const res = await API.post("/inventory/update", inventoryData);
    return res.data;
  } catch (error) {
    console.error("Error updating inventory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update inventory" };
  }
};

// Restock inventory (Admin only)
export const restockInventory = async (inventoryId, quantity) => {
  try {
    const res = await API.post("/inventory/restock", { id: inventoryId, quantity });
    return res.data;
  } catch (error) {
    console.error("Error restocking inventory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to restock inventory" };
  }
};

// Delete inventory (Admin only)
export const deleteInventory = async (inventoryId) => {
  try {
    const res = await API.post("/inventory/delete", { id: inventoryId });
    return res.data;
  } catch (error) {
    console.error("Error deleting inventory:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete inventory" };
  }
};
