import api from "./axios";

export const getDashboardMetrics = async() => {
    const response = await api.get("/dashboard")
    return response.data;


}