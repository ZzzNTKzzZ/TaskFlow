import { User } from './../../generated/prisma/index.d';

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}