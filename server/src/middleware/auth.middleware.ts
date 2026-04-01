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
      return next(new AppError("Unauthorized: No authorization header", 401));
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(new AppError("Unauthorized: Invalid token format", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401)); 
    }
    
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }

    next(new AppError("Unauthorized: Access denied", 401));
  }
};