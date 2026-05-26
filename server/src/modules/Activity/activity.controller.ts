import type { Request, Response } from "express";
import { ActivityService } from "./activity.service.js";
import { responseHandler } from "../../utils/responseHandler.js";

export class ActivityController {
  static async getMyActivities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const activities = await ActivityService.getUserActivities({
        userId,
        limit,
        skip,
      });
      res.status(200).json(responseHandler.success(activities));
    } catch (error) {
      console.log(error);
      res.status(500).json(responseHandler.error(error as any));
    }
  }

  static async getBoardActivities(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const activities = await ActivityService.getBoardActivities({
        boardId: boardId as string,
        limit,
        skip,
      });
      res.status(200).json(responseHandler.success(activities));
    } catch (error) {
      console.log(error);
      res.status(500).json(responseHandler.error(error as any));
    }
  }

  static async getWorkspaceActivities(req: Request, res: Response): Promise<void> {
    try {
      const { workspaceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const activities = await ActivityService.getWorkspaceActivities({
        workspaceId: workspaceId as string,
        limit,
        skip,
      });
      res.status(200).json(responseHandler.success(activities));
    } catch (error) {
      console.log(error);
      res.status(500).json(responseHandler.error(error as any));
    }
  }

  static async getCardActivities(req: Request, res: Response): Promise<void> {
    try {
      const { cardId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const activities = await ActivityService.getCardActivities({
        cardId: cardId as string,
        limit,
        skip,
      });
      res.status(200).json(responseHandler.success(activities));
    } catch (error) {
      console.log(error);
      res.status(500).json(responseHandler.error(error as any));
    }
  }
}
