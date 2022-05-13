/*
  Warnings:

  - You are about to drop the column `gameId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_gameId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gameId",
ADD COLUMN     "recent" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_recent_fkey" FOREIGN KEY ("recent") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
