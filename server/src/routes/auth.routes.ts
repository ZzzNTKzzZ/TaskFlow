import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthController } from "../controllers/auth.controller.js";

const authRoutes = Router()

authRoutes.post("/auth/register", asyncHandler(AuthController.register))