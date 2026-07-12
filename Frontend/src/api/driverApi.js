import axiosInstance from "./axiosInstance";

// GET all drivers (supports optional filters: status, licenseCategory)
export const getDrivers = async (filters = {}) => {
  const res = await axiosInstance.get("/drivers", { params: filters });
  return res.data;
};

// GET single driver by id
export const getDriverById = async (id) => {
  const res = await axiosInstance.get(`/drivers/${id}`);
  return res.data;
};

// CREATE driver
export const createDriver = async (driverData) => {
  const res = await axiosInstance.post("/drivers", driverData);
  return res.data;
};

// UPDATE driver
export const updateDriver = async (id, driverData) => {
  const res = await axiosInstance.put(`/drivers/${id}`, driverData);
  return res.data;
};

// DELETE driver
export const deleteDriver = async (id) => {
  const res = await axiosInstance.delete(`/drivers/${id}`);
  return res.data;
};