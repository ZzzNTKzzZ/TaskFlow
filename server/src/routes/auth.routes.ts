import { AuthController } from "../controllers/auth.controller.js";
import { Router } from "express";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimiter,
  validateMiddleware(registerSchema),
  AuthController.register,
);
authRoutes.post(
  "/login",
  authRateLimiter,
  validateMiddleware(loginSchema),
  AuthController.login,
);
authRoutes.post("/logout", authMiddleware, AuthController.logout);
authRoutes.post(
  "/refresh-token",
  AuthController.refresh,
);

authRoutes.get("/me", authMiddleware, AuthController.getMe)
export default authRoutes;
