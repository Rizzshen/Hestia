import api from "./axios";

export const getOrders = async () => {
  const res = await api.get("/api/orders");
  return res.data;
};

export const getOrder = async (id) => {
  const res = await api.get(`/api/orders/${id}`);
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.get(`/api/orders/${id}`, { status });
  return res.data;
};

export const createOrder = async (data) => {
  const res = await api.post("/api/orders", data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await api.delete(`/api/orders/${id}`);
  return res.data;
};
