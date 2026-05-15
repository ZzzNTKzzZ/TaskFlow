import type { Card } from "./card.js";

interface ListFull {
  id: string;
  name: string;
  position: 0;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  cards: Card[ ]
}
