import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthController } from "../controllers/auth.controller.js";

const authRoutes = Router()

authRoutes.post("/register", asyncHandler(AuthController.register))
authRoutes.post("/login", asyncHandler(AuthController.login))

export default authRoutes