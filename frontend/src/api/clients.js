import api from "./axios";

export const getClients = async () => {
  const res = await api.get("/api/clients");
  return res.data;
};
export const createClient = async (data) => {
  const res = await api.post("/api/clients", data);
  return res.data;
};
export const updateClient = async (id, data) => {
  const res = await api.put(`/api/clients/${id}`, data);
  return res.data;
};
export const deleteClient = async (id) => {
  const res = await api.delete(`/api/clients/${id}`);
  return res.data;
};
export const getClient = async (id) => {
  const res = await api.get(`/api/clients/${id}`);
  return res.data;
};
