const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getImageUrl = (path, folder) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}/uploads/${folder}/${path}`;
};

export const getProductImage = (imagePath) => getImageUrl(imagePath, 'products');
export const getCategoryImage = (imagePath) => getImageUrl(imagePath, 'categories');
export const getSubCategoryImage = (imagePath) => getImageUrl(imagePath, 'subcategories');
export const getBannerImage = (imagePath) => getImageUrl(imagePath, 'banners');
export const getUserImage = (imagePath) => getImageUrl(imagePath, 'users');
