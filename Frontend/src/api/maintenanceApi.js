import axiosInstance from "./axiosInstance";

// GET all maintenance records (optional filter: status = active/closed)
export const getMaintenanceRecords = async (filters = {}) => {
  const res = await axiosInstance.get("/maintenance", { params: filters });
  return res.data;
};

// CREATE maintenance record -> backend auto-sets vehicle status to "In Shop"
export const createMaintenanceRecord = async (data) => {
  const res = await axiosInstance.post("/maintenance", data);
  return res.data;
};

// CLOSE maintenance record -> backend auto-restores vehicle to "Available" (unless Retired)
export const closeMaintenanceRecord = async (id, data) => {
  const res = await axiosInstance.patch(`/maintenance/${id}/close`, data);
  return res.data;
};

// Get all vehicles for the dropdown (not just Available — a vehicle already In Shop
// shouldn't get a duplicate active record, so backend should validate this too)
export const getVehiclesForMaintenance = async () => {
  const res = await axiosInstance.get("/vehicles");
  return res.data;
};