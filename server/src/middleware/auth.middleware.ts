import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Unauthorized: No authorization header", 401);
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Unauthorized: Invalid token format", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError("Unauthorized: Invalid or expired token", 401));
  }
};