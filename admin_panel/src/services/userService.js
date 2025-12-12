import API from './api';

export const getAllUsers = async (filters = {}) => {
  try {
    const response = await API.post('/users/all', filters);
    // Return the data directly, handling both array and object responses
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await API.post('/users/single', { id: userId });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await API.post('/users/create', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error.response?.data || { message: 'Failed to create user' };
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await API.post('/users/update', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.response?.data || { message: 'Failed to update user' };
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await API.post('/users/delete', { id: userId });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};