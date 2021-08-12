/*
  Warnings:

  - You are about to drop the column `days` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[repeatId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_courseId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "days",
ADD COLUMN     "repeatId" INTEGER;

-- DropEnum
DROP TYPE "Days";

-- CreateTable
CREATE TABLE "Repeats" (
    "id" SERIAL NOT NULL,
    "type" "RepeatType" NOT NULL,
    "days" INTEGER[],

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_repeatId_unique" ON "Event"("repeatId");

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("repeatId") REFERENCES "Repeats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
