import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import WorkspaceController from "./workspace.controller.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { workspaceSchema } from "../../validators/workspace.schema.js";

const workspaceRoutes = Router();

workspaceRoutes.post(
  "/",
  validateMiddleware(workspaceSchema),
  asyncHandler(WorkspaceController.createWorkspace),
);

workspaceRoutes.get("/", asyncHandler(WorkspaceController.getWorkspaces));

workspaceRoutes.get(
  "/:workspaceId",
  asyncHandler(WorkspaceController.getWorkspaceById),
);

workspaceRoutes.delete(
  "/:workspaceId",
  asyncHandler(WorkspaceController.deleteWorkspace),
);

workspaceRoutes.get(
  "/:workspaceId/members",
  asyncHandler(WorkspaceController.getMembers),
);

workspaceRoutes.post(
  "/:workspaceId/members",
  asyncHandler(WorkspaceController.addMember),
);

workspaceRoutes.patch(
  "/:workspaceId/members/:memberId",
  asyncHandler(WorkspaceController.editMember),
);

workspaceRoutes.delete(
  "/:workspaceId/members/:memberId",
  asyncHandler(WorkspaceController.deleteMember),
);

workspaceRoutes.get(
  "/:workspaceId/boards",
  asyncHandler(WorkspaceController.getBoards),
);
export default workspaceRoutes;
