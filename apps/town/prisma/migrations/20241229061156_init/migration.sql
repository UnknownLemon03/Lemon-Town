-- CreateTable
CREATE TABLE "roommaps" (
    "roomid" INTEGER NOT NULL,
    "mapid" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,

    CONSTRAINT "roommaps_pkey" PRIMARY KEY ("roomid","mapid")
);

-- AddForeignKey
ALTER TABLE "roommaps" ADD CONSTRAINT "roommaps_mapid_fkey" FOREIGN KEY ("mapid") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roommaps" ADD CONSTRAINT "roommaps_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
