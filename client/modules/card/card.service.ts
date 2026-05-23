import { getCard } from "./card.api";

export default class CardService {
  static async getCard(boardId: string, cardId: string) {
    const response = await getCard(boardId, cardId);
    if (!response || !response.success || !response.data) {
      return {};
    }
    const payload = response.data;
    return payload
  }


}
