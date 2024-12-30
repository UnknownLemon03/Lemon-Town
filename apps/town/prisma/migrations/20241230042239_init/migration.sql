/*
  Warnings:

  - A unique constraint covering the columns `[roomid]` on the table `roommaps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "roommaps_roomid_key" ON "roommaps"("roomid");
