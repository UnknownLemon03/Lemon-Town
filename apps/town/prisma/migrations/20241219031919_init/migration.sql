-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "userid" INTEGER NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapid" INTEGER NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roomcontrol" (
    "userid" INTEGER NOT NULL,
    "roomid" INTEGER NOT NULL,

    CONSTRAINT "roomcontrol_pkey" PRIMARY KEY ("userid","roomid")
);

-- CreateTable
CREATE TABLE "roomaccess" (
    "userid" INTEGER NOT NULL,
    "roomid" INTEGER NOT NULL,

    CONSTRAINT "roomaccess_pkey" PRIMARY KEY ("userid","roomid")
);

-- CreateTable
CREATE TABLE "map" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "start" INTEGER NOT NULL DEFAULT -1,
    "end" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_userid_key" ON "roles"("userid");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room" ADD CONSTRAINT "room_mapid_fkey" FOREIGN KEY ("mapid") REFERENCES "map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
