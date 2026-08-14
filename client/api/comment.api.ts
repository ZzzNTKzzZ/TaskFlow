import { api } from "@/services/api";
import { ResponseApi } from "@/types/type";
import { Comment } from "@/types/comment";

export const getCommentsApi = async (boardId: string, cardId: string) => {
  try {
    const response = await api.get<ResponseApi<Comment[]>>(
      `/boards/${boardId}/cards/${cardId}/comments`
    );
    return response.data;
  } catch (error) {
    console.error("API Error [getCommentsApi]:", error);
    return { success: false, data: [] } as unknown as ResponseApi<Comment[]>;
  }
};

export const createCommentApi = async (boardId: string, cardId: string, content: string) => {
  try {
    const response = await api.post<ResponseApi<Comment>>(
      `/boards/${boardId}/cards/${cardId}/comments`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("API Error [createCommentApi]:", error);
    return { success: false } as unknown as ResponseApi<Comment>;
  }
};

export const updateCommentApi = async (boardId: string, cardId: string, commentId: string, content: string) => {
  try {
    const response = await api.patch<ResponseApi<Comment>>(
      `/boards/${boardId}/cards/${cardId}/comments/${commentId}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("API Error [updateCommentApi]:", error);
    return { success: false } as unknown as ResponseApi<Comment>;
  }
};

export const deleteCommentApi = async (boardId: string, cardId: string, commentId: string) => {
  try {
    const response = await api.delete<ResponseApi<{ message: string }>>(
      `/boards/${boardId}/cards/${cardId}/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error [deleteCommentApi]:", error);
    return { success: false } as unknown as ResponseApi<{ message: string }>;
  }
};
