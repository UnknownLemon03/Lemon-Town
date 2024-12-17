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
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roomcontrol" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "roomid" INTEGER NOT NULL,

    CONSTRAINT "roomcontrol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roomaccess" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL DEFAULT -1,
    "roomid" INTEGER NOT NULL DEFAULT -1,

    CONSTRAINT "roomaccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_userid_key" ON "roles"("userid");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomcontrol" ADD CONSTRAINT "roomcontrol_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_roomid_fkey" FOREIGN KEY ("roomid") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roomaccess" ADD CONSTRAINT "roomaccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
