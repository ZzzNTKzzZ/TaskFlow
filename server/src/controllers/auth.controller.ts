import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { responseHandler } from "../utils/responseHandler.js";

export class AuthController {
  // POST: /auth/register
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const data = await AuthService.register({name, email, password});

    // Trả về JSON để Mobile lưu vào Secure Storage
    res.status(201).json(responseHandler.success(data));
  }

  // POST: /auth/login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const data = await AuthService.login({email, password});

    res.status(200).json(responseHandler.success(data));
  }

  // POST: /auth/refresh-token
  static async refresh(req: Request, res: Response) {
    const { refreshToken: oldRefreshToken } = req.body;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Refresh Token is required" });
    }
    const data = await AuthService.refreshToken(oldRefreshToken);
    res.status(200).json(responseHandler.success(data));
  }

  // POST: /auth/logout
  static async logout(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const data = await AuthService.logout(refreshToken);
    res.status(200).json(responseHandler.success(data));
  }

  // GET: /auth/me
  static async getMe(req: Request, res: Response) {
    const userId = req.user?.userId; 
    const user = await AuthService.getCurrentUser(userId);
    res.status(200).json(responseHandler.success(user));
  }
}