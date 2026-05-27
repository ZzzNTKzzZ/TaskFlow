import { api } from "@/services/api";
import { Activity } from "./activity";
import { ApiResponse } from "@/types/types";

export const getGlobalActivitiesApi = async (limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>("/activities/me", {
      params: { limit, skip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getGlobalActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getBoardActivitiesApi = async (boardId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/board/${boardId}`, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getWorkspaceActivitiesApi = async (workspaceId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/workspace/${workspaceId}`, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getWorkspaceActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getCardActivitiesApi = async (cardId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/card/${cardId}`, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getCardActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};
