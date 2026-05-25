import { api } from "@/services/api";
import { ApiResponse, Card, CreateCardInListBody, List } from "@/types/types";

export const editListApi = async (boardId: string, listId: string, payload: { name?: string; position?: number }): Promise<ApiResponse<List>> => {
  try {
    const response = await api.patch<ApiResponse<List>>(`/${boardId}/lists/${listId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [editListApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const deleteListApi = async (boardId: string, listId: string): Promise<ApiResponse<List>> => {
  try {
    const response = await api.delete<ApiResponse<List>>(`/${boardId}/lists/${listId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [deleteListApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const getListCardsApi = async (boardId: string, listId: string): Promise<ApiResponse<Card[]>> => {
  try {
    const response = await api.get<ApiResponse<Card[]>>(`/${boardId}/lists/${listId}/cards`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getListCardsApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const createCardInListApi = async (boardId: string, listId: string, payload: CreateCardInListBody): Promise<ApiResponse<Card>> => {
  try {
    const response = await api.post<ApiResponse<Card>>(`/${boardId}/lists/${listId}/cards`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [createCardInListApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};
