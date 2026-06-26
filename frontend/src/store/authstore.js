import { create } from "zustand";
import { loginApi, logoutApi, getMeApi, registerApi } from "../api/auth";


export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const user = await getMeApi();
      set({ user, loading: false });
    } catch (error) {
      set({ user: null, loading: false });
      console.log(error);
    }
  },

  login: async (email, password) => {
    const user = await loginApi(email, password);
    set({ user });
    return user;
  },

  register: async (name, email, password, role) => {
    const user = await registerApi(name, email, password, role);
    set({ user });
    return user;
  },

  logout: async () => {
    await logoutApi();
    set({ user: null });
  },
}));
// export default useAuthStore;
