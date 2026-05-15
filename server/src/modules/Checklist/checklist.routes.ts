import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ChecklistController from "./checklist.controller.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import {
  createChecklistSchema,
  updateChecklistSchema,
  createChecklistItemSchema,
  updateChecklistItemSchema,
  completeChecklistItemSchema,
} from "../../validators/checklist.schema.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";

const checklistRoutes = Router({ mergeParams: true });

checklistRoutes.get("/", asyncHandler(ChecklistController.getCardChecklists));

checklistRoutes.post(
  "/",
  validateMiddleware(createChecklistSchema),
  permissionMiddleware("checklist:create"),
  asyncHandler(ChecklistController.createChecklist),
);

checklistRoutes.patch(
  "/:checklistId",
  validateMiddleware(updateChecklistSchema),
  permissionMiddleware("checklist:update"),
  asyncHandler(ChecklistController.updateChecklist),
);

checklistRoutes.delete(
  "/:checklistId",
  permissionMiddleware("checklist:delete"),
  asyncHandler(ChecklistController.deleteChecklist),
);

checklistRoutes.post(
  "/:checklistId/items",
  validateMiddleware(createChecklistItemSchema),
  permissionMiddleware("checklist:update"),
  asyncHandler(ChecklistController.createChecklistItem),
);

checklistRoutes.patch(
  "/:checklistId/items/:itemId",
  validateMiddleware(updateChecklistItemSchema),
  permissionMiddleware("checklist:update"),
  asyncHandler(ChecklistController.updateChecklistItem),
);

checklistRoutes.patch(
  "/:checklistId/items/:itemId/complete",
  validateMiddleware(completeChecklistItemSchema),
  permissionMiddleware("checklist:item:complete"),
  asyncHandler(ChecklistController.completeChecklistItem),
);

checklistRoutes.delete(
  "/:checklistId/items/:itemId",
  permissionMiddleware("checklist:update"),
  asyncHandler(ChecklistController.deleteChecklistItem),
);

export default checklistRoutes;
