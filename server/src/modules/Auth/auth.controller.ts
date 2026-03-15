import { AppError } from './../../utils/appError.js';
import { AuthService } from './auth.service.js';
import type { Request, Response } from "express";

export class AuthController {
  // POST: /auth/register
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.register(
      name,
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json(user);
  }

  // POST: /auth/login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.login(
      email,
      password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(user);
  }

  // POST: /auth/logout
  static async logout(req: Request, res: Response) {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(400).json({ message: "No refresh token" });
    }

    const logout = await AuthService.logout(token);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({ message: logout.message });
  }

  // POST: /auth/refresh-token
  static async refresh(req: Request, res: Response) {
    const { accessToken, refreshToken } = await AuthService.refreshToken(
      req.cookies.refreshToken,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "token refreshed" });
  }

  // GET: /auth/me
  static async getMe(req: Request, res: Response) {
    const userId = req.user.id

    if(!userId) return res.status(400).json({ message: "No userId"})
    const user = await AuthService.getCurrentUser(userId)

    res.status(200).json(user)
  }
}
