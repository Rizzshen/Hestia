import api from "./axios";

export const loginApi = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (name, email, password, role) => {
  const response = await api.post("/api/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};
export const getMeApi = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};
