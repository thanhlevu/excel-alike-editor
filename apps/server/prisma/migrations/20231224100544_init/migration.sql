/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `MergedCells` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sheets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "MergedCells" DROP CONSTRAINT "MergedCells_sheetId_fkey";

-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
ALTER COLUMN "sheetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("sheetId", "rowIndex", "colIndex");

-- DropTable
DROP TABLE "MergedCells";

-- DropTable
DROP TABLE "Sheets";

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MergedCell" (
    "sheetId" TEXT NOT NULL,
    "startRowIndex" INTEGER NOT NULL,
    "endRowIndex" INTEGER NOT NULL,
    "startColIndex" INTEGER NOT NULL,
    "endColIndex" INTEGER NOT NULL,

    CONSTRAINT "MergedCell_pkey" PRIMARY KEY ("sheetId","startRowIndex","endRowIndex","startColIndex","endColIndex")
);

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedCell" ADD CONSTRAINT "MergedCell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
