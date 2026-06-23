import { Router } from "express";
import ListController from "../controllers/list.controller.js";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { updateListSchema } from "../validators/list.schema.js";
import { createCardSchema } from "../validators/card.schema.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";
import { boardAccessMiddleware } from "../middleware/boardAccess.middleware.js";
import { workspaceAccess } from "../middleware/workspaceAccess.middleware.js";

const listRoutes = Router({ mergeParams: true });
// PATCH  /lists/:listId
listRoutes.patch(
  "/:listId",
  validateMiddleware(updateListSchema),
  permissionMiddleware("list:update"),
  ListController.editList,
);
// DELETE /lists/:listId
listRoutes.delete(
  "/:listId",
  permissionMiddleware("list:delete"),
  ListController.deleteList,
);
// GET  /lists/:listId/cards
listRoutes.get("/:listId/cards", ListController.getCards);
// POST /lists/:listId/cards
listRoutes.post(
  "/:listId/cards",
  validateMiddleware(createCardSchema),
  permissionMiddleware("card:create"),
  ListController.createCard,
);

export default listRoutes;
