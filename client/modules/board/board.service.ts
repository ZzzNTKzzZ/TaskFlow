import { getBoard } from "./board.api";

export default class BoardService {
    static async getBoard(boardId: string) {
        const response = await getBoard(boardId)
        if (!response || !response.success || !response.data) {
      return {};
    }

    const payload = response.data;
    return payload
    }
}
