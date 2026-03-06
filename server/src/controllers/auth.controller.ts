import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
    static async register(req: Request, res: Response) {
        const { name, email, password } = req.body

        const user = await AuthService.register(name, email, password)

        res.send(201).json(user)
    }
}