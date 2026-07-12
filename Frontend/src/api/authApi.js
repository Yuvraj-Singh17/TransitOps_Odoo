import axiosInstance from "./axiosInstance";

// Login -> returns { user, token }
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/auth/login", credentials);
  return res.data;
};

// Logout (optional - if backend tracks sessions/blacklists tokens)
export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

// Get currently logged-in user's profile (used to validate token on app reload)
export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

// Register a new user (if signup is needed - RBAC assigns role)
export const registerUser = async (userData) => {
  const res = await axiosInstance.post("/auth/register", userData);
  return res.data;
};

// Change password
export const changePassword = async (data) => {
  const res = await axiosInstance.post("/auth/change-password", data);
  return res.data;
};