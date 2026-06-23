import * as SecureStore from "expo-secure-store";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const onRequest = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // console.info(`[request] Data: ${JSON.stringify(config.data)}`);
  return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  // console.info(`[response] [${JSON.stringify(response.data)}]`);
  return response;
};

const onRequestError = async (error: AxiosError): Promise<AxiosError> => {
  console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};
const onResponseError = async (error: AxiosError): Promise<any> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // 1. Kiểm tra nếu là lỗi 401 (Unauthorized)
  if (error.response?.status === 401) {
    // Tránh vòng lặp vô tận nếu refresh cũng trả về 401
    if (!originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          throw new Error("No Refresh Token available");
        }

        // 2. Gọi API refresh. Lưu ý: Sử dụng instance 'axios' gốc để tránh interceptor của 'api'
        const response = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
          {
            refreshToken: refreshToken,
          },
        );
        console.log(response.data)
        const { data: payload, success } = response.data;

        if (success && payload) {
          const { accessToken, refreshToken: newRefreshToken } = payload;

          useAuthStore.getState().setTokens(accessToken, newRefreshToken);

          console.info(
            "[Auth] Refresh thành công! Đang thực hiện lại request...",
          );

          // 5. Gắn Access Token mới vào request bị lỗi lúc nãy
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // 6. Thực hiện lại request gốc với instance 'api'
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error(
          "[Auth] Refresh Token thất bại hoặc hết hạn. Đang đăng xuất...",
        );

        // 7. Xử lý khi refresh thất bại (ví dụ: đá người dùng ra màn hình login)
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
  }

  return Promise.reject(error);
};

api.interceptors.request.use(onRequest, onRequestError);
api.interceptors.response.use(onResponse, onResponseError);
