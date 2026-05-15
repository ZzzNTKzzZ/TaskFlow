export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  checklistId: string;
  createdAt: string;
}

export interface Checklist {
  id: string;
  title: string;
  cardId: string;
  createdAt: string;
  items: ChecklistItem[];
}
