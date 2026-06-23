export interface ChecklistItem {
  id: string;
  name: string;
  isCompleted: boolean;
  checklistId: string;
  createdAt: string;
}

export interface Checklist {
  id: string;
  name: string;
  cardId: string;
  createdAt: string;
  items: ChecklistItem[];
}
