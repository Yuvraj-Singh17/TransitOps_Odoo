import axiosInstance from "./axiosInstance";

// ---- Fuel Logs ----
export const getFuelLogs = async (filters = {}) => {
  const res = await axiosInstance.get("/fuel-logs", { params: filters });
  return res.data;
};

export const createFuelLog = async (data) => {
  const res = await axiosInstance.post("/fuel-logs", data);
  return res.data;
};

export const deleteFuelLog = async (id) => {
  const res = await axiosInstance.delete(`/fuel-logs/${id}`);
  return res.data;
};

// ---- Expenses (tolls, maintenance, insurance, etc.) ----
export const getExpenses = async (filters = {}) => {
  const res = await axiosInstance.get("/expenses", { params: filters });
  return res.data;
};

export const createExpense = async (data) => {
  const res = await axiosInstance.post("/expenses", data);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await axiosInstance.delete(`/expenses/${id}`);
  return res.data;
};

// ---- Cost Summary per vehicle: Total = Fuel + Maintenance + Expenses ----
export const getCostSummary = async (vehicleId) => {
  const res = await axiosInstance.get(`/reports/cost-summary`, {
    params: vehicleId ? { vehicleId } : {},
  });
  return res.data;
};

// Vehicles list for dropdowns
export const getVehiclesList = async () => {
  const res = await axiosInstance.get("/vehicles");
  return res.data;
};