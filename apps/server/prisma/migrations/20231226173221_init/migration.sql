/*
  Warnings:

  - You are about to drop the column `name` on the `Sheet` table. All the data in the column will be lost.
  - Added the required column `sheetName` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sheet" DROP COLUMN "name",
ADD COLUMN     "sheetName" TEXT NOT NULL;
