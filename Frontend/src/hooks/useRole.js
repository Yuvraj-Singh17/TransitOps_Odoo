import { useAuthStore } from "../store/authStore";

// Usage: const { role, hasAccess } = useRole();
// if (hasAccess([ROLES.FLEET_MANAGER])) { ... }
export function useRole() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || null;

  const hasAccess = (allowedRoles = []) => {
    if (allowedRoles.length === 0) return true; // open to all authenticated users
    return allowedRoles.includes(role);
  };

  return { role, hasAccess };
}