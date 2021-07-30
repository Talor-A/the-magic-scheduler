/*
  Warnings:

  - You are about to drop the column `sectionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_sectionId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "sectionId";

-- CreateTable
CREATE TABLE "_SectionToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SectionToUser_AB_unique" ON "_SectionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SectionToUser_B_index" ON "_SectionToUser"("B");

-- AddForeignKey
ALTER TABLE "Course" ADD FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectionToUser" ADD FOREIGN KEY ("A") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectionToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
