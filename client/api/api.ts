import axios from "axios";
import { getValidAccessToken, clearTokens } from '@/service/token.service';
import { router } from "expo-router";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  async (config) => {
    // getValidAccessToken đã lo việc check hạn và tự refresh rồi
    const token = await getValidAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // Nếu server vẫn báo 401 (nghĩa là refresh token cũng đã chết)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log("Phiên đăng nhập đã kết thúc hoàn toàn.");
      await clearTokens();
      
      // Điều hướng về Login
      router.replace("/Auth/Login");
    }
    
    return Promise.reject(error);
  }
);

export default api;