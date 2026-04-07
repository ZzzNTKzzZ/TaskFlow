import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import WorkspaceController from "./workspace.controller.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { workspaceSchema } from "../../validators/workspace.schema.js";
import { workspaceAccess } from "../../middleware/workspaceAccess.middleware.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";

const workspaceRoutes = Router();

// GET /workspaces
workspaceRoutes.get(
  "/",
  asyncHandler(WorkspaceController.getWorkspaces)
);

// POST /workspaces
workspaceRoutes.post(
  "/",
  validateMiddleware(workspaceSchema),
  asyncHandler(WorkspaceController.createWorkspace)
);

// GET /workspaces/:workspaceId
workspaceRoutes.get(
  "/:workspaceId",
  workspaceAccess,
  asyncHandler(WorkspaceController.getWorkspace)
);

// DELETE /workspaces/:workspaceId
workspaceRoutes.delete(
  "/:workspaceId",
  workspaceAccess,
  permissionMiddleware("workspace:delete"),
  asyncHandler(WorkspaceController.deleteWorkspace)
);

// ================= MEMBERS =================

// GET members
workspaceRoutes.get(
  "/:workspaceId/members",
  workspaceAccess,
  asyncHandler(WorkspaceController.getMembers)
);

// ADD member
workspaceRoutes.post(
  "/:workspaceId/members",
  workspaceAccess,
  permissionMiddleware("workspace:invite"),
  asyncHandler(WorkspaceController.addMember)
);

// EDIT member role
workspaceRoutes.patch(
  "/:workspaceId/members/:memberId",
  workspaceAccess,
  permissionMiddleware("workspace:change-role"),
  asyncHandler(WorkspaceController.editMember)
);

// DELETE member
workspaceRoutes.delete(
  "/:workspaceId/members/:memberId",
  workspaceAccess,
  permissionMiddleware("workspace:change-role"),
  asyncHandler(WorkspaceController.deleteMember)
);

// ================= BOARDS =================

// GET boards
workspaceRoutes.get(
  "/:workspaceId/boards",
  workspaceAccess,
  permissionMiddleware("board:view"),
  asyncHandler(WorkspaceController.getBoards)
);

// POST boards
workspaceRoutes.post(
  "/:workspaceId/boards",
  workspaceAccess,
  permissionMiddleware("board:create"),
  asyncHandler(WorkspaceController.createBoard)
)

workspaceRoutes.patch(
  "/:workspaceId/boards/reorder",
  asyncHandler(WorkspaceController.reorder)
);
export default workspaceRoutes;