import { create } from 'zustand';
import { loginApi, logoutApi, getMeApi } from '../api/auth';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true, // Start as true to block UI until we verify the session

  // Fetches the user on initial app load or page refresh
  fetchUser: async () => {
    try {
      const user = await getMeApi();
      set({ user, loading: false });
    } catch (error) {
      // If it fails (401), the user is not logged in or token expired
      set({ user: null, loading: false });
    }
  },

  // Handles login
  login: async (email, password) => {
    const user = await loginApi(email, password);
    set({ user });
    return user;
  },

  // Handles logout
  logout: async () => {
    await logoutApi();
    set({ user: null });
  },
}));