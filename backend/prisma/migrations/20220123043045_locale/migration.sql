/*
  Warnings:

  - Added the required column `locale` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "locale" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "locale" TEXT;
