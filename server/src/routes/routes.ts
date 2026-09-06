import type { Express } from "express";
import authRoutes from "./auth.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import workspaceRoutes from "./workspace.routes.js";
import boardRoutes from "./board.routes.js";
import { boardAccessMiddleware } from "../middleware/boardAccess.middleware.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";
import listRoutes from "./list.routes.js";
import cardRoutes from "./card.routes.js";
import { workspaceAccess } from "../middleware/workspaceAccess.middleware.js";
import checklistRoutes from "./checklist.routes.js";
import activityRoutes from "./activity.routes.js";
import searchRoutes from "./search.routes.js";

export const routes = (app: Express) => {
  app.use("/auth", authRoutes);
  app.use("/search", authMiddleware, searchRoutes);
  app.use("/activities", authMiddleware, activityRoutes);
  app.use("/workspaces", authMiddleware, workspaceRoutes);
  app.use(
    "/boards",
    authMiddleware,
    boardRoutes,
  );
  app.use(
    "/:boardId/lists",
    authMiddleware,
    boardAccessMiddleware,
    listRoutes,
  );
  app.use(
    "/:boardId/cards",
    authMiddleware,
    boardAccessMiddleware,
    cardRoutes,
  );
};
