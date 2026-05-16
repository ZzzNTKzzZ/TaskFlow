import { Priority } from "@/types/type";
import { Checklist } from "../checklist/checklist";

export interface CardRespone {
  id: string;
  name: string;
  description: string;
  position: number;
  dueDate: string;
  listId: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  checkListCount: number;
  checklists: Checklist[];
}
