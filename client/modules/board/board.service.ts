import {createBoardListApi, getBoardApi } from "./board.api";

export default class BoardService {
    static async getBoard(boardId: string) {
        const response = await getBoardApi(boardId)
        if (!response || !response.success || !response.data) {
      return {};
    }

    const payload = response.data;
    return payload
    }

    static async createList(payload: { boardId: string, name: string}) {
       const response = await createBoardListApi(payload.boardId, payload.name)
        if (!response || !response.success || !response.data) {
      return {};
    }

    const data = response.data;
    return data
    }
}
