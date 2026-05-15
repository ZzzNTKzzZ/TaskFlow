import type { Priority } from "../../generated/prisma/index.js";
import type { Checklist } from "./checklist.js";

export interface Card {
  id: string;
  name: string;
  description?: string | "";
  position: number;
  dueDate: string;
  listId: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  checklists: Checklist[];
}
