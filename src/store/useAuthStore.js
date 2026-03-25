import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,

      login: (data) =>
        set({
          user: data.admin,
          token: data.token,
          role: data.role,
          isAuthenticated: true,
        }),

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        });

        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
