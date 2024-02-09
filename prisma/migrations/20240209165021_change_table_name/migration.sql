/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Weight" DROP CONSTRAINT "Weight_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "ApplicationUser" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,

    CONSTRAINT "ApplicationUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_username_key" ON "ApplicationUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUser_email_key" ON "ApplicationUser"("email");

-- AddForeignKey
ALTER TABLE "Weight" ADD CONSTRAINT "Weight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ApplicationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
