import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import WorkspaceController from "../controllers/workspace.controller.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { workspaceSchema } from "../validators/workspace.schema.js";

const workspaceRoutes = Router();

workspaceRoutes.post(
  "/",
  validateMiddleware(workspaceSchema),
  asyncHandler(WorkspaceController.createWorkspace),
);

workspaceRoutes.get(
    "/",
    asyncHandler(WorkspaceController.getWorkspaces)
)

workspaceRoutes.get(
    "/:workspaceId",
    asyncHandler(WorkspaceController.getWorkspaceById)
)

workspaceRoutes.delete(
    "/:workspaceId",
    asyncHandler(WorkspaceController.deleteWorkspace)
)

export default workspaceRoutes