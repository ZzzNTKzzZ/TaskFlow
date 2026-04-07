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
