import api from "./axios";

export const getRawMaterials = async () => {
  const res = await api.get("/api/raw-materials");
  return res.data;
};

export const createRawMaterial = async (data) => {
  const res = await api.post("/api/raw-materials", data);
  return res.data;
};

export const updateRawMaterial = async (id, data) => {
  const res = await api.put(`/api/raw-materials/${id}`, data);
  return res.data;
};

export const deleteRawMaterial = async (id) => {
  const res = await api.delete(`/api/raw-materials/${id}`);
  return res.data;
};

export const getRawMaterial = async (id) => {
  const res = await api.get(`/api/raw-materials/${id}`);
  return res.data;
};
