import { defineStore } from "pinia";

function getStoredUser() {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch (e) {
    console.warn("Invalid user data in localStorage, clearing it");
    localStorage.removeItem("user");
    return null;
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: getStoredUser()
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    login(data) {
      this.token = data.token;
      this.user = data.user;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    },

    logout() {
      this.token = null;
      this.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});
