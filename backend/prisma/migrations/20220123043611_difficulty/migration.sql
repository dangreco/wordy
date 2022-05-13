/*
  Warnings:

  - You are about to drop the column `size` on the `Game` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'INSANE');

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "size",
ADD COLUMN     "difficulty" "Difficulty" NOT NULL;
