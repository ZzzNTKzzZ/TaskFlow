export interface Comment {
  id: string;
  cardId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
}
