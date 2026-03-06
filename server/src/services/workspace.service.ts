import { prisma } from "../lib/prisma.js";

export class WorkspaceService {
    static async getWorkspace() {
        const workspace = await prisma.workspace.findMany({
            where: {}
        })
    }
}