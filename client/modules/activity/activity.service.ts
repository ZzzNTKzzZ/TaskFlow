import {
  getBoardActivitiesApi,
  getCardActivitiesApi,
  getGlobalActivitiesApi,
  getWorkspaceActivitiesApi,
} from "./activity.api";
import { Activity } from "./activity";

export default class ActivityService {
  /**
   * Fetch global activities for the current user.
   */
  static async getGlobalActivities(limit: number = 20, skip: number = 0): Promise<Activity[]> {
    const response = await getGlobalActivitiesApi(limit, skip);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }

  /**
   * Fetch activities specific to a board.
   */
  static async getBoardActivities(boardId: string, limit: number = 20, skip: number = 0): Promise<Activity[]> {
    const response = await getBoardActivitiesApi(boardId, limit, skip);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }

  /**
   * Fetch activities specific to a workspace.
   */
  static async getWorkspaceActivities(workspaceId: string, limit: number = 20, skip: number = 0): Promise<Activity[]> {
    const response = await getWorkspaceActivitiesApi(workspaceId, limit, skip);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }

  /**
   * Fetch activities specific to a card.
   */
  static async getCardActivities(cardId: string, limit: number = 20, skip: number = 0): Promise<Activity[]> {
    const response = await getCardActivitiesApi(cardId, limit, skip);
    if (!response || !response.success || !response.data) {
      return [];
    }
    return response.data;
  }
}
