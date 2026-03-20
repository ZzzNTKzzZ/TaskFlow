import { asyncHandler } from "../../utils/asyncHandler.js";
import { Router } from "express";
import { validateMiddleware } from "../../middleware/validate.middleware.js";
import { updateBoardSchema } from "../../validators/board.schema.js";
import BoardController from "./board.controller.js";

const boardRoutes = Router();

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

boardRoutes.post(
  "/:boardId/members",
  // validateMiddleware(),
  asyncHandler(BoardController.addMembers)
);
boardRoutes.delete(
  "/:boardId/members/:userId",
  asyncHandler(BoardController.deleteMember),
);
boardRoutes.patch("/reorder", asyncHandler(BoardController.reorder));
export default boardRoutes;
