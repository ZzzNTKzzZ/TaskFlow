import { Router } from "express";
import ListController from "./list.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { updateListSchema } from "../../validators/list.schema.js";

const listRoutes = Router();
// PATCH  /lists/:listId
listRoutes.patch('/:listId', validateMiddleware(updateListSchema), asyncHandler(ListController.editList));
// DELETE /lists/:listId
listRoutes.delete('/:listId', asyncHandler(ListController.deleteList));
// GET  /lists/:listId/cards
listRoutes.get('/:listId/cards', asyncHandler(ListController.getCards));
// POST /lists/:listId/cards
listRoutes.post('/:listId/cards', asyncHandler(ListController.createCard));

export default listRoutes;
