import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import CardController from "./card.controller.js";
import checklistRoutes from "../Checklist/checklist.routes.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { cardSchema, updateCardSchema } from "../../validators/card.schema.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";

const cardRoutes = Router();

cardRoutes.get("/:cardId", asyncHandler(CardController.getCard));
cardRoutes.patch("/reorder", asyncHandler(CardController.reorderCard));
cardRoutes.patch(
  "/:cardId",
  validateMiddleware(updateCardSchema),
  permissionMiddleware("card:update"),
  asyncHandler(CardController.updateCard),
);
cardRoutes.delete(
  "/:cardId",
  permissionMiddleware("card:delete"),
  asyncHandler(CardController.deleteCard),
);

cardRoutes.patch(
  "/:cardId/assignees",
  permissionMiddleware("card:assign"),
  asyncHandler(CardController.assigneessUser),
);
cardRoutes.delete(
  "/:cardId/assignees/:userId",
  asyncHandler(CardController.unassignUser),
);

cardRoutes.use("/:cardId/checklists", checklistRoutes);

export default cardRoutes;
