import { loginApi, signupApi } from "../api/auth.api";
import { LoginData, LoginResponse, SignUpData } from "../types/auth";

export default class AuthService {
    static async login(data: LoginData):Promise<LoginResponse> {
        const response = await loginApi(data)
        return response
    }

    static async signup(data: SignUpData): Promise<LoginResponse> {
        const response = await signupApi(data)
        return response
    }
}
