import { Priority } from "@/types/type";

export interface Card {
    id: string,
    name: string,
    description: string,
    position: number,
    dueDate: string,
    listId: string,
    priority: Priority,
    createdAt: string,
    updatedAt: string
}