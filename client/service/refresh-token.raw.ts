import axios from 'axios';

// Dùng một instance axios mới hoàn toàn, KHÔNG dùng cái 'api' bị dính interceptor
export const refreshTokenRaw = async (refreshToken: string) => {
  const response = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/refresh`, {
    refreshToken: refreshToken
  });
  return response.data; // { accessToken, refreshToken }
};