import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,       // { id, name, email, role }
      token: null,
      isAuthenticated: false,

      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      hasRole: (allowedRoles = []) => {
        const state = useAuthStore.getState();
        if (!state.user) return false;
        return allowedRoles.includes(state.user.role);
      },
    }),
    {
      name: "transitops-auth", // localStorage key
    }
  )
);