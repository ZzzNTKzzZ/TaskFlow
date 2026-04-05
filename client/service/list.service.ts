import api from "@/api/api";

export const getListsByBoardIdApi = async (boardId: string) => {
    try {
        const response = await api.get(`/lists/${boardId}/lists`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createListApi = async (boardId: string, title: string) => {
    try {
        const response = await api.post(`/lists/${boardId}/lists`, { title });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
