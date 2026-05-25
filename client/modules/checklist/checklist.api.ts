import { api } from "@/services/api";
import {
  ApiResponse,
  Checklist,
  ChecklistItem,
  UpdateChecklistItemBody,
} from "@/types/types";

export const getCardChecklistsApi = async (boardId: string, cardId: string): Promise<ApiResponse<Checklist[]>> => {
  try {
    const response = await api.get<ApiResponse<Checklist[]>>(`/${boardId}/cards/${cardId}/checklists`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getCardChecklistsApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const createChecklistApi = async (boardId: string, cardId: string, name: string): Promise<ApiResponse<Checklist>> => {
  try {
    const response = await api.post<ApiResponse<Checklist>>(`/${boardId}/cards/${cardId}/checklists`, { name });
    return response.data;
  } catch (error: any) {
    console.error("API Error [createChecklistApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const updateChecklistApi = async (boardId: string, cardId: string, checklistId: string, name: string): Promise<ApiResponse<Checklist>> => {
  try {
    const response = await api.patch<ApiResponse<Checklist>>(`/${boardId}/cards/${cardId}/checklists/${checklistId}`, { name });
    return response.data;
  } catch (error: any) {
    console.error("API Error [updateChecklistApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const deleteChecklistApi = async (boardId: string, cardId: string, checklistId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/${boardId}/cards/${cardId}/checklists/${checklistId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [deleteChecklistApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const createChecklistItemApi = async (boardId: string, cardId: string, checklistId: string, name: string): Promise<ApiResponse<ChecklistItem>> => {
  try {
    const response = await api.post<ApiResponse<ChecklistItem>>(`/${boardId}/cards/${cardId}/checklists/${checklistId}/items`, { name });
    return response.data;
  } catch (error: any) {
    console.error("API Error [createChecklistItemApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const updateChecklistItemApi = async (
  boardId: string,
  cardId: string,
  checklistId: string,
  itemId: string,
  payload: UpdateChecklistItemBody
): Promise<ApiResponse<ChecklistItem>> => {
  try {
    const response = await api.patch<ApiResponse<ChecklistItem>>(`/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [updateChecklistItemApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const completeChecklistItemApi = async (
  boardId: string,
  cardId: string,
  checklistId: string,
  itemId: string,
  isCompleted: boolean
): Promise<ApiResponse<ChecklistItem>> => {
  try {
    const response = await api.patch<ApiResponse<ChecklistItem>>(
      `/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}/complete`,
      { isCompleted }
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error [completeChecklistItemApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const deleteChecklistItemApi = async (boardId: string, cardId: string, checklistId: string, itemId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [deleteChecklistItemApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};
