import API from "./api";

// Get all delivery staff
export const getDeliveryStaff = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/deliveries/all", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching delivery staff:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch delivery staff" };
  }
};

// Create delivery staff
export const createDeliveryStaff = async (deliveryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/deliveries/create", deliveryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating delivery staff:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create delivery staff" };
  }
};

// Update delivery staff
export const updateDeliveryStaff = async (deliveryData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/deliveries/update", deliveryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating delivery staff:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update delivery staff" };
  }
};

// Delete delivery staff
export const deleteDeliveryStaff = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await API.post("/deliveries/delete", { id }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting delivery staff:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete delivery staff" };
  }
};
