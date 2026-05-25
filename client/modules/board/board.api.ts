import { api } from "@/services/api";
import { ApiResponse, BoardResponse, List } from "@/types/types";

export const getBoardApi = async (boardId: string): Promise<ApiResponse<BoardResponse>> => {
  try {
    const response = await api.get<ApiResponse<BoardResponse>>(`/boards/${boardId}`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};

export const getBoardListsApi = async (boardId: string): Promise<ApiResponse<List[]>> => {
  try {
    const response = await api.get<ApiResponse<List[]>>(`/boards/${boardId}/lists`);
    return response.data;
  } catch (error: any) {
    console.error("API Error [getBoardListsApi]:", error);
    return { success: false, data: [], message: error.message };
  }
};

export const createBoardListApi = async (boardId: string, name: string): Promise<ApiResponse<List>> => {
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
  try {
    const response = await api.patch<ApiResponse<List>>(`/boards/${boardId}/lists/reorder`, payload);
    return response.data;
  } catch (error: any) {
    console.error("API Error [reorderListsApi]:", error);
    return { success: false, data: null as any, message: error.message };
  }
};
