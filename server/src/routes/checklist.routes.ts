import { Router } from "express";
import ChecklistController from "../controllers/checklist.controller.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import {
  createChecklistSchema,
  updateChecklistSchema,
  createChecklistItemSchema,
  updateChecklistItemSchema,
  completeChecklistItemSchema,
} from "../validators/checklist.schema.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";

const checklistRoutes = Router({ mergeParams: true });

checklistRoutes.get("/", ChecklistController.getCardChecklists);

checklistRoutes.post(
  "/",
  validateMiddleware(createChecklistSchema),
  permissionMiddleware("checklist:create"),
  ChecklistController.createChecklist,
);

checklistRoutes.patch(
  "/:checklistId",
  validateMiddleware(updateChecklistSchema),
  permissionMiddleware("checklist:update"),
  ChecklistController.updateChecklist,
);

checklistRoutes.delete(
  "/:checklistId",
  permissionMiddleware("checklist:delete"),
  ChecklistController.deleteChecklist,
);

checklistRoutes.post(
  "/:checklistId/items",
  validateMiddleware(createChecklistItemSchema),
  permissionMiddleware("checklist:update"),
  ChecklistController.createChecklistItem,
);

checklistRoutes.patch(
  "/:checklistId/items/:itemId",
  validateMiddleware(updateChecklistItemSchema),
  permissionMiddleware("checklist:update"),
  ChecklistController.updateChecklistItem,
);

checklistRoutes.patch(
  "/:checklistId/items/:itemId/complete",
  validateMiddleware(completeChecklistItemSchema),
  permissionMiddleware("checklist:item:complete"),
  ChecklistController.completeChecklistItem,
);

checklistRoutes.delete(
  "/:checklistId/items/:itemId",
  permissionMiddleware("checklist:update"),
  ChecklistController.deleteChecklistItem,
);

export default checklistRoutes;
