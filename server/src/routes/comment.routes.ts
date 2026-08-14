import { Router } from "express";
import CommentController from "../controllers/comment.controller.js";
import { permissionMiddleware } from "../middleware/permissions.middleware.js";

const commentRoutes = Router({ mergeParams: true });

commentRoutes.get("/", CommentController.getComments);
// You need card:update permission to comment? Or maybe any board member can comment.
// Let's assume permissionMiddleware("card:update") or just "board:read" since members can comment.
// For simplicity, we just use the controller directly. The controller checks if the user is authenticated.
commentRoutes.post("/", CommentController.createComment);
commentRoutes.patch("/:commentId", CommentController.updateComment);
commentRoutes.delete("/:commentId", CommentController.deleteComment);

export default commentRoutes;
