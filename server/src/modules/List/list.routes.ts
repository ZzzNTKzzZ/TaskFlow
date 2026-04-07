import { Router } from "express";
import ListController from "./list.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { updateListSchema } from "../../validators/list.schema.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";

const listRoutes = Router();
// PATCH  /lists/:listId
listRoutes.patch(
  "/:listId",
  validateMiddleware(updateListSchema),
  permissionMiddleware("list:update"),
  asyncHandler(ListController.editList),
);
// DELETE /lists/:listId
listRoutes.delete("/:listId", permissionMiddleware("list:delete"),asyncHandler(ListController.deleteList));
// GET  /lists/:listId/cards
listRoutes.get("/:listId/cards",asyncHandler(ListController.getCards));
// POST /lists/:listId/cards
listRoutes.post("/:listId/cards", permissionMiddleware("card:create"),asyncHandler(ListController.createCard));

export default listRoutes;
