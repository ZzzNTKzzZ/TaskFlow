import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller.js";

const router = Router();

router.get("/me",ActivityController.getMyActivities);
router.get("/board/:boardId", ActivityController.getBoardActivities);
router.get("/workspace/:workspaceId", ActivityController.getWorkspaceActivities);
router.get("/card/:cardId", ActivityController.getCardActivities);

export default router;
