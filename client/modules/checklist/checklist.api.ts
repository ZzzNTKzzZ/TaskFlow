import { api } from "@/services/api";

export const getCardChecklists = async (cardId: string) => {
  try {
    const response = await api.get(`/cards/${cardId}/checklists`);
    return response.data;
  } catch (error) {
    console.error("API Error [getCardChecklists]:", error);
    return { success: false, data: [] };
  }
};

export const createChecklist = async (cardId: string, payload: any) => {
  try {
    const response = await api.post(`/cards/${cardId}/checklists`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [createChecklist]:", error);
    return { success: false };
  }
};

export const updateChecklist = async (cardId: string, checklistId: string, payload: any) => {
  try {
    const response = await api.patch(`/cards/${cardId}/checklists/${checklistId}`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [updateChecklist]:", error);
    return { success: false };
  }
};

export const deleteChecklist = async (cardId: string, checklistId: string) => {
  try {
    const response = await api.delete(`/cards/${cardId}/checklists/${checklistId}`);
    return response.data;
  } catch (error) {
    console.error("API Error [deleteChecklist]:", error);
    return { success: false };
  }
};

export const createChecklistItem = async (cardId: string, checklistId: string, payload: any) => {
  try {
    const response = await api.post(`/cards/${cardId}/checklists/${checklistId}/items`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [createChecklistItem]:", error);
    return { success: false };
  }
};

export const updateChecklistItem = async (cardId: string, checklistId: string, itemId: string, payload: any) => {
  try {
    const response = await api.patch(`/cards/${cardId}/checklists/${checklistId}/items/${itemId}`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [updateChecklistItem]:", error);
    return { success: false };
  }
};

export const completeChecklistItem = async (cardId: string, checklistId: string, itemId: string, payload: any) => {
  try {
    const response = await api.patch(`/cards/${cardId}/checklists/${checklistId}/items/${itemId}/complete`, payload);
    return response.data;
  } catch (error) {
    console.error("API Error [completeChecklistItem]:", error);
    return { success: false };
  }
};

export const deleteChecklistItem = async (cardId: string, checklistId: string, itemId: string) => {
  try {
    const response = await api.delete(`/cards/${cardId}/checklists/${checklistId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error("API Error [deleteChecklistItem]:", error);
    return { success: false };
  }
};
