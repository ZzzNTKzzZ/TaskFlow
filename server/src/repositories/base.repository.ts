import { prisma } from "../lib/prisma.js";

export abstract class BaseRepository<TModel> {
  constructor(protected model: any) {}

  async findById(id: string): Promise<TModel | null> {
    return await this.model.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<TModel> {
    return await this.model.delete({
      where: { id },
    });
  }

  async findMany(): Promise<TModel[]> {
    return await this.model.findMany();
  }
}
