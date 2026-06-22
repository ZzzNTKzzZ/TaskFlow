import { api } from "@/services/api";
import { Activity } from "./activity";
import { ApiResponse } from "@/types/types";

export const getGlobalActivitiesApi = async (limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  const safeLimit = Math.max(1, Math.floor(limit) || 20);
  const safeSkip = Math.max(0, Math.floor(skip) || 0);
  try {
    const response = await api.get<ApiResponse<Activity[]>>("/activities/me", {
      params: { limit: safeLimit, skip: safeSkip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getGlobalActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getBoardActivitiesApi = async (boardId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  if (!boardId || boardId === "undefined") {
    return { success: false, data: [] as any, message: "Invalid board ID" };
  }
  const safeLimit = Math.max(1, Math.floor(limit) || 20);
  const safeSkip = Math.max(0, Math.floor(skip) || 0);
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/board/${boardId}`, {
      params: { limit: safeLimit, skip: safeSkip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getWorkspaceActivitiesApi = async (workspaceId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  if (!workspaceId || workspaceId === "undefined") {
    return { success: false, data: [] as any, message: "Invalid workspace ID" };
  }
  const safeLimit = Math.max(1, Math.floor(limit) || 20);
  const safeSkip = Math.max(0, Math.floor(skip) || 0);
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/workspace/${workspaceId}`, {
      params: { limit: safeLimit, skip: safeSkip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getWorkspaceActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};

export const getCardActivitiesApi = async (cardId: string, limit: number = 20, skip: number = 0): Promise<ApiResponse<Activity[]>> => {
  if (!cardId || cardId === "undefined") {
    return { success: false, data: [] as any, message: "Invalid card ID" };
  }
  const safeLimit = Math.max(1, Math.floor(limit) || 20);
  const safeSkip = Math.max(0, Math.floor(skip) || 0);
  try {
    const response = await api.get<ApiResponse<Activity[]>>(`/activities/card/${cardId}`, {
      params: { limit: safeLimit, skip: safeSkip },
    });
    return response.data;
  } catch (error: any) {
    console.error("API Error [getCardActivitiesApi]:", error);
    return { success: false, data: [] as any, message: error.message };
  }
};
