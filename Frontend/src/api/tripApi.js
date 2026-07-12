import axiosInstance from "./axiosInstance";

// GET all trips (optional filters: status, region)
export const getTrips = async (filters = {}) => {
  const res = await axiosInstance.get("/trips", { params: filters });
  return res.data;
};

// GET single trip
export const getTripById = async (id) => {
  const res = await axiosInstance.get(`/trips/${id}`);
  return res.data;
};

// CREATE trip (Draft status)
export const createTrip = async (tripData) => {
  const res = await axiosInstance.post("/trips", tripData);
  return res.data;
};

// DISPATCH trip -> vehicle & driver become "On Trip"
export const dispatchTrip = async (id) => {
  const res = await axiosInstance.patch(`/trips/${id}/dispatch`);
  return res.data;
};

// COMPLETE trip -> requires final odometer + fuel consumed
export const completeTrip = async (id, completionData) => {
  const res = await axiosInstance.patch(`/trips/${id}/complete`, completionData);
  return res.data;
};

// CANCEL trip -> restores vehicle & driver to Available
export const cancelTrip = async (id) => {
  const res = await axiosInstance.patch(`/trips/${id}/cancel`);
  return res.data;
};

// Helper endpoints for dropdowns - only Available vehicles/drivers
export const getAvailableVehicles = async () => {
  const res = await axiosInstance.get("/vehicles", { params: { status: "Available" } });
  return res.data;
};

export const getAvailableDrivers = async () => {
  const res = await axiosInstance.get("/drivers", { params: { status: "Available" } });
  return res.data;
};