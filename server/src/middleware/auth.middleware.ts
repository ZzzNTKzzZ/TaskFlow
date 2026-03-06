import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/appError.js"
const authMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth = req.headers.authorization
            const [scheme, token] = auth?.split(" ") ?? [];

            if(!token || scheme !== "Bearer") throw new AppError( "Unauthorized: No token provided", 401)
            

            const decode = jwt.verify(token, process.env.JWT_SECRET!);

            (req as any).user = decode
            next()
        } catch (error) {
            throw new AppError("Unauthorized: Invalid token", 401)
        }
    }
}