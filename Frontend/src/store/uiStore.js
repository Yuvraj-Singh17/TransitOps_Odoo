import { create } from "zustand";
import { persist } from "zustand/middleware";

// Bonus feature: Dark mode toggle (spec section 8)
export const useUiStore = create(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,

      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          // Apply to <html> tag so Tailwind's dark: classes work
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { darkMode: next };
        }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "transitops-ui",
    }
  )
);