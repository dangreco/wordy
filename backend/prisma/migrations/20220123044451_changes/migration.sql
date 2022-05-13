/*
  Warnings:

  - A unique constraint covering the columns `[userId,word]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_userId_word_key" ON "Game"("userId", "word");
