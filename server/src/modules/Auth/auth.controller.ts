import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  // POST: /auth/register
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.register({name, email, password});

    // Trả về JSON để Mobile lưu vào Secure Storage
    res.status(201).json({
      status: "success",
      data: { user, accessToken, refreshToken }
    });
  }

  // POST: /auth/login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login({email, password});

    res.status(200).json({
      status: "success",
      data: { user, accessToken, refreshToken }
    });
  }

  // POST: /auth/refresh-token
  static async refresh(req: Request, res: Response) {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Refresh Token is required" });
    }

    const { accessToken, refreshToken } = await AuthService.refreshToken(oldRefreshToken);

    res.status(200).json({
      status: "success",
      data: { accessToken, refreshToken }
    });
  }

  // POST: /auth/logout
  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    res.status(200).json({ message: "Logged out successfully" });
  }

  // GET: /auth/me
  static async getMe(req: Request, res: Response) {
    // req.user được gán từ Middleware bảo vệ (protect)
    const userId = (req as any).user?.id; 
    const user = await AuthService.getCurrentUser(userId);
    res.status(200).json({ status: "success", data: { user } });
  }
}