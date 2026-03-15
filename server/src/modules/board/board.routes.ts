import { asyncHandler } from "../../utils/asyncHandler.js";
import { Router } from "express";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { boardSchema, updateBoardSchema } from "../../validators/board.schema.js";
import { permissionMiddleware } from "../../middleware/permissions.middleware.js";
import BoardController from "./board.controller.js";

const boardRoutes = Router();

// CREATE board
boardRoutes.post(
  "/",
  permissionMiddleware,
  validateMiddleware(boardSchema),
  asyncHandler(BoardController.createBoard),
);

// GET board
boardRoutes.get("/:boardId", asyncHandler(BoardController.getBoard));

// UPDATE board
boardRoutes.patch(
  "/:boardId",
  validateMiddleware(updateBoardSchema),
  asyncHandler(BoardController.editBoard),
);

// DELETE board
boardRoutes.delete("/:boardId", asyncHandler(BoardController.deleteBoard));

// BOARD MEMBER

boardRoutes.get("/:boardId/members", asyncHandler(BoardController.getMembers));

boardRoutes.post("/:boardId/members", asyncHandler(BoardController.addMembers));
boardRoutes.delete(
  "/:boardId/members/:userId",
  asyncHandler(BoardController.deleteMember),
);
boardRoutes.patch("/reorder", asyncHandler(BoardController.reorder));
export default boardRoutes;
