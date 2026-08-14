import { api } from "@/services/api";
import { ApiResponse, BoardResponse, List, GetBoardMembersResponse } from "@/types/types";

export const getBoardApi = async (boardId: string): Promise<ApiResponse<BoardResponse>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: null as any, message: "Invalid board ID" };
  }
  try {
    const response = await api.get<ApiResponse<BoardResponse>>(`/boards/${boardId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const getBoardMembersApi = async (boardId: string): Promise<ApiResponse<GetBoardMembersResponse>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: [], message: "Invalid board ID" };
  }
  try {
    const response = await api.get<ApiResponse<GetBoardMembersResponse>>(`/boards/${boardId}/members`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardMembersApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const getBoardListsApi = async (boardId: string): Promise<ApiResponse<List[]>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: [], message: "Invalid board ID" };
  }
  try {
    const response = await api.get<ApiResponse<List[]>>(`/boards/${boardId}/lists`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardListsApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const createBoardListApi = async (boardId: string, name: string): Promise<ApiResponse<List>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: null as any, message: "Invalid board ID" };
  }
  try {
    const response = await api.post<ApiResponse<List>>(`/boards/${boardId}/lists`, { name });
    return response.data;
  } catch (error: any) {
    console.error("API Error [createBoardListApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const reorderListsApi = async (
  boardId: string,
  payload: { listId: string; beforeId?: string | null; afterId?: string | null }
): Promise<ApiResponse<List>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: null as any, message: "Invalid board ID" };
  }
  try {
    const response = await api.patch<ApiResponse<List>>(`/boards/${boardId}/lists/reorder`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [reorderListsApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const deleteBoardApi = async (boardId: string): Promise<ApiResponse<any>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: null, message: "Invalid board ID" };
  }
  try {
    const response = await api.delete<ApiResponse<any>>(`/boards/${boardId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [deleteBoardApi]:", error);
    return { success: false, data: null, message: error.message };
  }
};

export const updateBoardApi = async (
  boardId: string,
  payload: { name?: string; background?: string; visibility?: string }
): Promise<ApiResponse<any>> => {
  if (!boardId || boardId === "undefined" || boardId.startsWith("(")) {
    return { success: false, data: null, message: "Invalid board ID" };
  }
  try {
    const response = await api.patch<ApiResponse<any>>(`/boards/${boardId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [updateBoardApi]:", error);
    return { success: false, data: null, message: error.message };
  }
};
