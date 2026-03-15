import type { Express } from "express";
import authRoutes from "../modules/Auth/auth.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import workspaceRoutes from "../modules/Workspace/workspace.routes.js";
import boardRoutes from "../modules/Board/board.routes.js";
import { boardAccessMiddleware } from "../middleware/boardAccess.middleware.js";
export const routes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/workspaces", authMiddleware, workspaceRoutes);
  app.use("/boards", authMiddleware, boardAccessMiddleware, boardRoutes);
};
