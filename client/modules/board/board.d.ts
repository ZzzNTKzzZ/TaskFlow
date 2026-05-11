import { BackgroundColor } from "@/components/illustrations/BackgroundCard";
import { Visibility } from "@/types/type";

interface BoardResponse {
    id: string,
    name: string,
    background: string,
    visibility: Visibility,
    workspaceId: string,
    memberCount: number,
    position: number,
    createdAt: string,
    updateedAt: string,
}

export interface BoardCardUI {
    id: string,
    name: string,
    memberCount: number,
    background: BackgroundColor
}

