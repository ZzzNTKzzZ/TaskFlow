import type { Express } from "express";
import authRoutes from "../modules/Auth/auth.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import workspaceRoutes from "../modules/Workspace/workspace.routes.js";
import boardRoutes from "../modules/Board/board.routes.js";
import { boardAccessMiddleware } from "../middleware/boardAccess.middleware.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";
import listRoutes from "../modules/List/list.routes.js";
import cardRoutes from "../modules/Card/card.routes.js";

export const routes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/workspaces", authMiddleware, workspaceRoutes);
  app.use(
    "/boards",
    authMiddleware,
    boardAccessMiddleware,
    permissionMiddleware,
    boardRoutes,
  );
  app.use(
    "/lists",
    authMiddleware,
    boardAccessMiddleware,
    permissionMiddleware,
    listRoutes,
  );
  app.use(
    "/cards",
    authMiddleware,
    cardRoutes,
  );
};
