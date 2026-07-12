// Roles
export const ROLES = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Driver",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

// Vehicle status
export const VEHICLE_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  IN_SHOP: "In Shop",
  RETIRED: "Retired",
};

// Driver status
export const DRIVER_STATUS = {
  AVAILABLE: "Available",
  ON_TRIP: "On Trip",
  OFF_DUTY: "Off Duty",
  SUSPENDED: "Suspended",
};

// Trip lifecycle
export const TRIP_STATUS = {
  DRAFT: "Draft",
  DISPATCHED: "Dispatched",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Status badge colors (maps to index.css theme vars)
export const STATUS_COLOR_MAP = {
  [VEHICLE_STATUS.AVAILABLE]: "bg-status-available",
  [VEHICLE_STATUS.ON_TRIP]: "bg-status-ontrip",
  [VEHICLE_STATUS.IN_SHOP]: "bg-status-inshop",
  [VEHICLE_STATUS.RETIRED]: "bg-status-retired",
  [DRIVER_STATUS.OFF_DUTY]: "bg-status-offduty",
  [DRIVER_STATUS.SUSPENDED]: "bg-status-suspended",
};

// Vehicle types (used in Dashboard filters - 3.2)
export const VEHICLE_TYPES = ["Truck", "Van", "Mini Truck", "Trailer"];

// API base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";