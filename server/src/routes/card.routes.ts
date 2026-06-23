import { Router } from "express";
import CardController from "../controllers/card.controller.js";
import checklistRoutes from "./checklist.routes.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { updateCardSchema, reorderCardSchema } from "../validators/card.schema.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";

const cardRoutes = Router({ mergeParams: true });

cardRoutes.get("/:cardId", CardController.getCard);
cardRoutes.patch(
  "/reorder",
  validateMiddleware(reorderCardSchema),
  CardController.reorderCard,
);
cardRoutes.patch(
  "/:cardId",
  validateMiddleware(updateCardSchema),
  permissionMiddleware("card:update"),
  CardController.updateCard,
);
cardRoutes.delete(
  "/:cardId",
  permissionMiddleware("card:delete"),
  CardController.deleteCard,
);

cardRoutes.patch(
  "/:cardId/assignees",
  permissionMiddleware("card:assign"),
  CardController.assigneessUser,
);
cardRoutes.delete(
  "/:cardId/assignees/:userId",
  CardController.unassignUser,
);

cardRoutes.use("/:cardId/checklists", checklistRoutes);

export default cardRoutes;
