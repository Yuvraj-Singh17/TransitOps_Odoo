import axiosInstance from "./axiosInstance";

// GET all vehicles (supports optional filters: type, status, region)
export const getVehicles = async (filters = {}) => {
  const res = await axiosInstance.get("/vehicles", { params: filters });
  return res.data;
};

// GET single vehicle by id
export const getVehicleById = async (id) => {
  const res = await axiosInstance.get(`/vehicles/${id}`);
  return res.data;
};

// CREATE vehicle
export const createVehicle = async (vehicleData) => {
  const res = await axiosInstance.post("/vehicles", vehicleData);
  return res.data;
};

// UPDATE vehicle
export const updateVehicle = async (id, vehicleData) => {
  const res = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
  return res.data;
};

// DELETE vehicle
export const deleteVehicle = async (id) => {
  const res = await axiosInstance.delete(`/vehicles/${id}`);
  return res.data;
};