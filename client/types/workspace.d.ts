import { SymbolColor, SymbolName } from "@/components/icons/SymbolIcon";
import { RoleWorkspace } from "@/types/types";

type StatsWorkspace = {
  memberCount: number;
  boardCount: number;
  cardCount: number;
};

interface WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  stats: StatsWorkspace;
  currentUser: { role: RoleWorkspace };
  icon?: string;
  color?: string;
}

interface WorkspaceCard {
  id: string;
  value: string;
  name: string;
  memberCount: number;
  role: RoleWorkspace;
  icon: SymbolName;
  color: SymbolColor;
}

interface WorkspaceMemberRespone {
  id: string;
  name: string;
  email: string;
  role: RoleWorkspace;
}
