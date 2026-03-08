import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthController } from "../controllers/auth.controller.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

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
  "/refresh`",
  authMiddleware,
  asyncHandler(AuthController.refresh),
);

authRoutes.get("/me", authMiddleware, asyncHandler(AuthController.getMe))
export default authRoutes;
