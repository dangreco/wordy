/*
  Warnings:

  - You are about to drop the column `locale` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "locale",
ADD COLUMN     "language" TEXT NOT NULL DEFAULT E'English';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locale",
ADD COLUMN     "language" TEXT;
