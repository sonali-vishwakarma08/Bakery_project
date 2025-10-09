import api from './api';

export const getInventory = async () => {
  const res = await api.get('/inventory');
  return res.data;
};
