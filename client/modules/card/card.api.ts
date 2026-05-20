import { api } from "@/services/api";

export const getCard = async (boardId: string, cardId: string) => {
  try {
    const respone = await api.get(`/boards/${boardId}/cards/${cardId}`);
    console.log(respone);
    return respone.data;
  } catch (error) {
    console.error("API Error [getCardApi]:", error);
    return { success: false, data: [] };
  }
};
