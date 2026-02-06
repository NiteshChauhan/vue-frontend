import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const http = axios.create({
  // baseURL: "http://localhost:5000/api"
  baseURL: "https://node-backend-gules-two.vercel.app/api",
});

http.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default http;
