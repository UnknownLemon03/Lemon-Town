/*
  Warnings:

  - The primary key for the `map` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roommaps` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "roommaps" DROP CONSTRAINT "roommaps_mapid_fkey";

-- AlterTable
ALTER TABLE "map" DROP CONSTRAINT "map_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "map_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "roommaps" DROP CONSTRAINT "roommaps_pkey",
ALTER COLUMN "mapid" SET DATA TYPE TEXT,
ADD CONSTRAINT "roommaps_pkey" PRIMARY KEY ("roomid", "mapid");

-- AddForeignKey
ALTER TABLE "roommaps" ADD CONSTRAINT "roommaps_mapid_fkey" FOREIGN KEY ("mapid") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
