import api from "@/api/api";

export const createCardApi = async (data: {
    title: string;
    description?: string;
    listId: string;
    priority?: "low" | "medium" | "high" | "urgent";
    dueDate?: string | null;
}) => {
    try {
        const response = await api.post(`/cards`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateCardApi = async (cardId: string, data: any) => {
    try {
        const response = await api.patch(`/cards/${cardId}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteCardApi = async (cardId: string) => {
    try {
        const response = await api.delete(`/cards/${cardId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
