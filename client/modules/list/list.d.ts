import { Card } from "../card/card";

export interface ListCardUI {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  cardCount: number;
  position: number;
  cards: Card[]
}
