import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

// Usage: <ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER]}>...</ProtectedRoute>
// If allowedRoles is empty, only checks login (any authenticated user allowed)
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;