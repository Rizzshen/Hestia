import api from "./axios";

export const getRawMaterials = async () => {
  const res = await api.get("/raw-materials");
  return res.data;
};

export const createRawMaterials = async(data)=> {
    const res = await api.post('/raw-materials', data);
    return res.data;
};

