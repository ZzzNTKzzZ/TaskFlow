import { loginApi, signupApi } from "../api/auth.api";
import { LoginData, LoginResponse, SignUpData } from "../types/auth";

export default class AuthService {
  static async login(data: LoginData): Promise<LoginResponse> {
    const { success, data: payload}  = await loginApi(data);
    return {
      success,
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    };
  }

  static async signup(data: SignUpData): Promise<LoginResponse> {
    const response = await signupApi(data);
    return response;
  }
}
