import { Router } from "express";
import { validateMiddleware } from "../middleware/validate.middleware.js";
import { updateBoardSchema, addBoardMembersSchema, reorderListSchema } from "../validators/board.schema.js";
import BoardController from "../controllers/board.controller.js";
import { listSchema } from "../validators/list.schema.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";
import { boardAccessMiddleware } from "../middleware/boardAccess.middleware.js";

const boardRoutes = Router({ mergeParams: true });

// GET    /boards/:boardId
boardRoutes.get("/:boardId", BoardController.getBoard);

// PATCH  /boards/:boardId
boardRoutes.patch(
  "/:boardId",
  validateMiddleware(updateBoardSchema),
  boardAccessMiddleware,
  permissionMiddleware("board:update"),
  BoardController.editBoard,
);

// DELETE /boards/:boardId
boardRoutes.delete(
  "/:boardId",
  boardAccessMiddleware,
  permissionMiddleware("board:delete"),
  BoardController.deleteBoard,
);

// GET    /boards/:boardId/members
boardRoutes.get(
  "/:boardId/members",
  boardAccessMiddleware,
  permissionMiddleware("board:view"),
  BoardController.getMembers,
);

// POST   /boards/:boardId/members
boardRoutes.post(
  "/:boardId/members",
  validateMiddleware(addBoardMembersSchema),
  boardAccessMiddleware,
  permissionMiddleware("board:update"),
  BoardController.addMembers,
);

// DELETE /boards/:boardId/members/:userId
boardRoutes.delete(
  "/:boardId/members/:userId",
  boardAccessMiddleware,
  permissionMiddleware("board:update"),
  BoardController.deleteMember,
);

// GET  /boards/:boardId/lists
boardRoutes.get("/:boardId/lists", BoardController.getLists);

// POST /boards/:boardId/lists
boardRoutes.post(
  "/:boardId/lists",
  validateMiddleware(listSchema),
  boardAccessMiddleware,
  permissionMiddleware("list:create"),
  BoardController.createList
);

// PATCH /boards/:boardId/lists/reorder
boardRoutes.patch(
  "/:boardId/lists/reorder",
  validateMiddleware(reorderListSchema),
  boardAccessMiddleware,
  permissionMiddleware("list:reorder"),
  BoardController.reorderList,
);

export default boardRoutes;
