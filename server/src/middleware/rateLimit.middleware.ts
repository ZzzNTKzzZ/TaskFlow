import { rateLimit } from "express-rate-limit";
import { AppError } from "../utils/appError.js";

// Limiter for authentication routes (login, register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError("Too many login or register attempts. Please try again after 15 minutes.", 429));
  },
});

// General API rate limiter to prevent DDoS / abuse
export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError("Too many requests from this IP. Please try again in a minute.", 429));
  },
});
