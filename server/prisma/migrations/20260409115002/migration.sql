/*
  Warnings:

  - You are about to drop the column `title` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `List` table. All the data in the column will be lost.
  - Added the required column `name` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Board" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "List" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
