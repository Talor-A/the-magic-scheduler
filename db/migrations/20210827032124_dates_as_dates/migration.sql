/*
  Warnings:

  - You are about to drop the `CalendarDate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarDate" DROP CONSTRAINT "CalendarDate_eventEndId_fkey";

-- DropForeignKey
ALTER TABLE "CalendarDate" DROP CONSTRAINT "CalendarDate_eventStartId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_eventEndId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_eventStartId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "CalendarDate";

-- DropTable
DROP TABLE "Time";
