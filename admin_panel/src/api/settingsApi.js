import API from "./api";

export const getSettings = async () => {
  try {
    const res = await API.get("/settings/get");
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch settings" };
  }
};

export const updateSettings = async (settingsData) => {
  try {
    const res = await API.post("/settings/update", settingsData);
    return res.data;
  } catch (error) {
    console.error("Error updating settings:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update settings" };
  }
};

export const resetSettings = async () => {
  try {
    const res = await API.post("/settings/reset");
    return res.data;
  } catch (error) {
    console.error("Error resetting settings:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to reset settings" };
  }
};
