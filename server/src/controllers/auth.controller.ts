import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

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
    return res.send(201).json(user);
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
    return res.send(201).json(user);
  }

  // POST: /auth/logout
  static async logout(req: Request, res: Response) {
    const logout = await AuthService.logout(req.cookies.refreshToken)

    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")

    return res.send(201).json(logout.message)
  }
}
