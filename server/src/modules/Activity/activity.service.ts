import type { ActivityType } from "../../types/type.js";
import { AppError } from "../../utils/appError.js";
import ActivityRepository from "./activity.repository.js";


export class ActivityService {
  static async logActivity(data: {
    boardId: string;
    userId: string;
    cardId?: string;
    listId?: string;
    action: ActivityType;
    description: string;
    metadata?: any;
  }) {
    return await ActivityRepository.createActivity(data);
  }

  /**
   * Get global activities for a specific user.
   * This includes activities across all boards the user is a member of.
   */
  static async getUserActivities({
    userId,
    limit = 20,
    skip = 0,
  }: {
    userId: string;
    limit?: number;
    skip?: number;
  }) {
    if (!userId) throw new AppError("User id is required", 400);

    const activities = await ActivityRepository.findUserActivities({
      userId,
      limit,
      skip,
    });

    return activities;
  }

  /**
   * Get activities scoped to a specific board.
   */
  static async getBoardActivities({
    boardId,
    limit = 20,
    skip = 0,
  }: {
    boardId: string;
    limit?: number;
    skip?: number;
  }) {
    if (!boardId) throw new AppError("Board id is required", 400);

    const activities = await ActivityRepository.findBoardActivities({
      boardId,
      limit,
      skip,
    });

    return activities;
  }

  /**
   * Get activities scoped to a specific workspace.
   */
  static async getWorkspaceActivities({
    workspaceId,
    limit = 20,
    skip = 0,
  }: {
    workspaceId: string;
    limit?: number;
    skip?: number;
  }) {
    if (!workspaceId) throw new AppError("Workspace id is required", 400);

    const activities = await ActivityRepository.findWorkspaceActivities({
      workspaceId,
      limit,
      skip,
    });

    return activities;
  }

  /**
   * Get activities scoped to a specific card.
   */
  static async getCardActivities({
    cardId,
    limit = 20,
    skip = 0,
  }: {
    cardId: string;
    limit?: number;
    skip?: number;
  }) {
    if (!cardId) throw new AppError("Card id is required", 400);

    const activities = await ActivityRepository.findCardActivities({
      cardId,
      limit,
      skip,
    });

    return activities;
  }
}
