import { AuthController } from './auth.controller.js';
import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validateMiddleware(registerSchema),
  asyncHandler(AuthController.register),
);
authRoutes.post(
  "/login",
  validateMiddleware(loginSchema),
  asyncHandler(AuthController.login),
);
authRoutes.post("/logout", authMiddleware, asyncHandler(AuthController.logout));
authRoutes.post(
  "/refresh-token",
  authMiddleware,
  asyncHandler(AuthController.refresh),
);

authRoutes.get("/me", authMiddleware, asyncHandler(AuthController.getMe))
export default authRoutes;
