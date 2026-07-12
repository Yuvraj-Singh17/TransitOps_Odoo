import axiosInstance from "./axiosInstance";

// Fuel Efficiency: Distance / Fuel per vehicle
export const getFuelEfficiencyReport = async () => {
  const res = await axiosInstance.get("/reports/fuel-efficiency");
  return res.data;
};

// Fleet Utilization %
export const getUtilizationReport = async () => {
  const res = await axiosInstance.get("/reports/utilization");
  return res.data;
};

// Operational Cost (Fuel + Maintenance + Expenses) per vehicle
export const getOperationalCostReport = async () => {
  const res = await axiosInstance.get("/reports/operational-cost");
  return res.data;
};

// Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
export const getVehicleRoiReport = async () => {
  const res = await axiosInstance.get("/reports/vehicle-roi");
  return res.data;
};