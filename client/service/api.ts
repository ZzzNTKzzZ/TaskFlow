import * as SecureStore from 'expo-secure-store';
import axios from "axios"
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_BASE_URL,
    timeout: 10000
})
// Trong file api.ts
api.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token hết hạn hoặc không hợp lệ, đang xử lý...");
      
      // Cách 1: Xóa token và bắt đăng nhập lại (Đơn giản nhất)
      await SecureStore.deleteItemAsync("accessToken");
      
      // Bạn có thể dùng thư viện điều hướng (ví dụ React Navigation) 
      // để chuyển về màn hình Login ở đây
      // navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);
export default api