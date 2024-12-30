/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `map` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_userid_fkey";

-- DropForeignKey
ALTER TABLE "roomaccess" DROP CONSTRAINT "roomaccess_roomid_fkey";

-- DropForeignKey
ALTER TABLE "roomaccess" DROP CONSTRAINT "roomaccess_userid_fkey";

-- DropForeignKey
ALTER TABLE "roomcontrol" DROP CONSTRAINT "roomcontrol_roomid_fkey";

-- DropForeignKey
ALTER TABLE "roomcontrol" DROP CONSTRAINT "roomcontrol_userid_fkey";

-- DropForeignKey
ALTER TABLE "roommaps" DROP CONSTRAINT "roommaps_mapid_fkey";

-- DropForeignKey
ALTER TABLE "roommaps" DROP CONSTRAINT "roommaps_roomid_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "map_name_key" ON "map"("name");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommaps" ADD CONSTRAINT "roommaps_mapid_fkey" FOREIGN KEY ("mapid") REFERENCES "map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommaps" ADD CONSTRAINT "roommaps_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
