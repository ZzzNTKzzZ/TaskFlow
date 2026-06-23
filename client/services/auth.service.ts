import { loginApi, signupApi, refreshTokenApi } from "@/api/auth.api";
import { LoginData, LoginResponse, SignUpData } from "@/types/auth";

export default class AuthService {
  static async login(data: LoginData): Promise<LoginResponse> {
    const res = await loginApi(data);
    if (!res.success) {
      return {
        success: false,
        errMsg: res.errMsg,
      } as any;
    }
    const payload = res.data;
    return {
      success: true,
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }

  static async signup(data: SignUpData): Promise<LoginResponse> {
    const res = await signupApi(data);
    if (!res.success) {
      return {
        success: false,
        errMsg: res.errMsg,
      } as any;
    }
    const payload = res.data;
    return {
      success: true,
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }

  static async refresh() {
    const response = await refreshTokenApi();
    return response;
  }
}
