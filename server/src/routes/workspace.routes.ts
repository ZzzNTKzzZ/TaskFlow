import { Router } from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { workspaceSchema, updateWorkspaceSchema } from "../validators/workspace.schema.js";
import { createBoardSchema } from "../validators/board.schema.js";
import { workspaceAccess } from "../middleware/workspaceAccess.middleware.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";

const workspaceRoutes = Router();

// GET /workspaces
workspaceRoutes.get(
  "/",
  WorkspaceController.getWorkspaces
);

// POST /workspaces
workspaceRoutes.post(
  "/",
  validateMiddleware(workspaceSchema),
  WorkspaceController.createWorkspace
);

// GET /workspaces/:workspaceId
workspaceRoutes.get(
  "/:workspaceId",
  workspaceAccess,
  WorkspaceController.getWorkspace
);

// PATCH  /workspaces/:workspaceId
workspaceRoutes.patch(
  "/:workspaceId",
  validateMiddleware(updateWorkspaceSchema),
  workspaceAccess,
  WorkspaceController.editWorkspace
)

// DELETE /workspaces/:workspaceId
workspaceRoutes.delete(
  "/:workspaceId",
  workspaceAccess,
  permissionMiddleware("workspace:delete"),
  WorkspaceController.deleteWorkspace
);

// ================= MEMBERS =================

// GET members
workspaceRoutes.get(
  "/:workspaceId/members",
  workspaceAccess,
  WorkspaceController.getMembers
);

// ADD member
workspaceRoutes.post(
  "/:workspaceId/members",
  workspaceAccess,
  permissionMiddleware("workspace:invite"),
  WorkspaceController.addMember
);

// EDIT member role
workspaceRoutes.patch(
  "/:workspaceId/members/:memberId",
  workspaceAccess,
  permissionMiddleware("workspace:change-role"),
  WorkspaceController.editMember
);

// DELETE member
workspaceRoutes.delete(
  "/:workspaceId/members/:memberId",
  workspaceAccess,
  permissionMiddleware("workspace:change-role"),
  WorkspaceController.deleteMember
);

// ================= BOARDS =================

// GET timeline
workspaceRoutes.get(
  "/:workspaceId/timeline",
  workspaceAccess,
  WorkspaceController.getTimeline
);

// GET boards
workspaceRoutes.get(
  "/:workspaceId/boards",
  workspaceAccess,
  permissionMiddleware("board:view"),
  WorkspaceController.getBoards
);

// POST boards
workspaceRoutes.post(
  "/:workspaceId/boards",
  validateMiddleware(createBoardSchema),
  workspaceAccess,
  permissionMiddleware("board:create"),
  WorkspaceController.createBoard
)

workspaceRoutes.patch(
  "/:workspaceId/boards/reorder",
  workspaceAccess,
  WorkspaceController.reorder
);
export default workspaceRoutes;