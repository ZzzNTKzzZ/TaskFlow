import { api } from "@/services/api";

export const editList = async (listId: string, payload: any) => {
  try {
    const response = await api.patch(`/lists/${listId}`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [editList]:", error);
    return { success: false };
  }
};

export const deleteList = async (listId: string) => {
  try {
    const response = await api.delete(`/lists/${listId}`);
    return response.data;
  } catch (error) {
    console.error("API Error [deleteList]:", error);
    return { success: false };
  }
};

export const getListCards = async (listId: string) => {
  try {
    const response = await api.get(`/lists/${listId}/cards`);
    return response.data;
  } catch (error) {
    console.error("API Error [getListCards]:", error);
    return { success: false, data: [] };
  }
};

export const createCardInList = async (boardId: string,listId: string, payload: any) => {
  try {
    const response = await api.post(`/${boardId}/lists/${listId}/cards`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [createCardInList]:", error);
    return { success: false };
  }
};
