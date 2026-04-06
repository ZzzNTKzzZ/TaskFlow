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
    // getValidAccessToken nên trả về null nếu hoàn toàn không thể lấy được token
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
    // Kiểm tra nếu lỗi không phải do mạng (ví dụ server sập hoặc sai URL)
    if (!error.response) {
      console.error("Lỗi kết nối mạng hoặc Server không phản hồi");
      return Promise.reject(error);
    }

    const { status, config } = error.response;

    // Nếu server báo 401 (Unauthorized)
    if (status === 401) {
      // Tránh lặp lại điều hướng nếu đã đang ở trang login
      // Hoặc nếu endpoint chính là endpoint login/refresh thì không chặn ở đây
      console.warn("Phiên đăng nhập hết hạn hoặc không hợp lệ.");
      
      await clearTokens();
      
      // Sử dụng setTimeout để đảm bảo quá trình reject request hoàn tất trước khi chuyển trang
      setTimeout(() => {
        if (router.canGoBack()) router.dismissAll(); // Dọn dẹp stack cũ nếu cần
        router.replace("/Auth/Login");
      }, 0);
    }
    
    return Promise.reject(error);
  }
);

export default api;