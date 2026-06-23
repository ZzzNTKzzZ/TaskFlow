import { ActivityType } from "@/types/type";

export type Activity = {
  id: string;
  action: ActivityType;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  board?: {
    name: string;
  };
};
