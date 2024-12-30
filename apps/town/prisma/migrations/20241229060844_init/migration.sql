/*
  Warnings:

  - You are about to drop the column `mapid` on the `room` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "room" DROP CONSTRAINT "room_mapid_fkey";

-- AlterTable
ALTER TABLE "room" DROP COLUMN "mapid";
