import api from "./axios";

export const getDashboardMetrics = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};
