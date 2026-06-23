import api from "./axios";

export const getOrderItems = async (orderId) => {
  const res = await api.get(`/api/orders/${orderId}/items`);
  return res.data;
};

export const addOrderItem = async (orderId, data) => {
  const res = await api.post(`/api/orders/${orderId}/items`, data);
  return res.data;
};

export const deleteOrderItem = async (orderId, itemId) => {
  const res = await api.delete(`/api/orders/${orderId}/items/${itemId}`);
  return res.data;
};
