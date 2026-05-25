import { api } from "@/services/api";
import {
  ApiResponse,
  Card,
  CardAssignee,
  GetCardResponse,
  ReorderCardBody,
  UpdateCardBody,
} from "@/types/types";

export const getCardApi = async (boardId: string, cardId: string): Promise<ApiResponse<GetCardResponse>> => {
  try {
    const response = await api.get<ApiResponse<GetCardResponse>>(`/${boardId}/cards/${cardId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getCardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const updateCardApi = async (boardId: string, cardId: string, payload: UpdateCardBody): Promise<ApiResponse<Card>> => {
  try {
    const response = await api.patch<ApiResponse<Card>>(`/${boardId}/cards/${cardId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [updateCardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const reorderCardApi = async (boardId: string, payload: ReorderCardBody): Promise<ApiResponse<Card>> => {
  try {
    const response = await api.patch<ApiResponse<Card>>(`/${boardId}/cards/reorder`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [reorderCardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const deleteCardApi = async (boardId: string, cardId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/${boardId}/cards/${cardId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [deleteCardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const assignUsersToCardApi = async (boardId: string, cardId: string, userIds: string[]): Promise<ApiResponse<CardAssignee[]>> => {
  try {
    const response = await api.patch<ApiResponse<CardAssignee[]>>(`/${boardId}/cards/${cardId}/assignees`, { userIds });
    return response.data;
  } catch (error: any) {
    console.error("API Error [assignUsersToCardApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const unassignUserFromCardApi = async (boardId: string, cardId: string, userId: string): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/${boardId}/cards/${cardId}/assignees/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [unassignUserFromCardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};
