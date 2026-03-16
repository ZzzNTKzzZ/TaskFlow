import type { WorkspaceMember, WorkspaceRole } from '../../generated/prisma/index.js';
import { User } from './../../generated/prisma/index.d';

declare global {
    namespace Express {
        interface Request {
            user?: User,
            workspaceMember?: WorkspaceMember
        }
    }
}