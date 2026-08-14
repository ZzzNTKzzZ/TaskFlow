import { BackgroundColor } from "@/components/illustrations/BackgroundCard";
import { Visibility } from "@/types/types";

interface BoardResponse {
    id: string,
    name: string,
    background: string,
    visibility: Visibility,
    workspaceId: string,
    memberCount: number,
    cardCount: number,
    listCount: number
    position: number,
    createdAt: string,
    updateedAt: string,
}

export interface BoardCardUI {
    id: string,
    name: string,
    background: BackgroundColor
    memberCount: number,
    listCount: number,
    cardCount: number
}
