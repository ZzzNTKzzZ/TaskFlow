import { Router } from "express";
import ListController from "./list.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { listSchema } from "../../validators/list.schema.js";

const listRoutes = Router();

listRoutes.get("/:boardId/lists", asyncHandler(ListController.getLists));
listRoutes.post(
  "/:boardId/lists",
  validateMiddleware(listSchema),
  asyncHandler(ListController.createList),
);
listRoutes.patch("/lists/:listsId", asyncHandler(ListController.editList));
listRoutes.delete("/lists/:listsId", asyncHandler(ListController.deleteList));
listRoutes.delete(
  "/:boardId/lists/reorder",
  asyncHandler(ListController.reorder),
);

export default listRoutes;
