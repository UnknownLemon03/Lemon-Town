/*
  Warnings:

  - You are about to drop the column `end` on the `roommaps` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `roommaps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roommaps" DROP COLUMN "end",
DROP COLUMN "start";
