import { asyncHandler } from "../../utils/asyncHandler.js";
import { Router } from "express";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { updateBoardSchema } from "../../validators/board.schema.js";
import BoardController from "./board.controller.js";
import { listSchema } from "../../validators/list.schema.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";
import { boardAccessMiddleware } from "../../middleware/boardAccess.middleware.js";

const boardRoutes = Router();

// GET    /boards/:boardId
boardRoutes.get("/:boardId", asyncHandler(BoardController.getBoard));
// PATCH  /boards/:boardId
boardRoutes.patch(
  "/:boardId",
  validateMiddleware(updateBoardSchema),
  permissionMiddleware("board:create"),
  asyncHandler(BoardController.editBoard),
);
// DELETE /boards/:boardId
boardRoutes.delete(
  "/:boardId",
  permissionMiddleware("board:delete"),
  asyncHandler(BoardController.deleteBoard),
);

// GET    /boards/:boardId/members
boardRoutes.get("/:boardId/members", asyncHandler(BoardController.getMembers));
// POST   /boards/:boardId/members
boardRoutes.post("/:boardId/members", asyncHandler(BoardController.addMembers));
// DELETE /boards/:boardId/members/:userId
boardRoutes.delete(
  "/:boardId/members/:userId",
  asyncHandler(BoardController.deleteMember),
);
// GET  /boards/:boardId/lists
boardRoutes.get("/:boardId/lists", asyncHandler(BoardController.getLists));
// POST /boards/:boardId/lists
boardRoutes.post(
  "/:boardId/lists",
  validateMiddleware(listSchema),
  boardAccessMiddleware,
  permissionMiddleware("list:create"),
  asyncHandler(BoardController.createList)
);
// PATCH /boards/:boardId/lists/reorder
boardRoutes.patch("/reorder", asyncHandler(BoardController.reorderList));
export default boardRoutes;
