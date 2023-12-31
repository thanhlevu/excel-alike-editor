/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cellId` on the `Cell` table. All the data in the column will be lost.
  - The primary key for the `MergedCell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mergedCellId` on the `MergedCell` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Cell_sheetId_rowIndex_colIndex_key";

-- DropIndex
DROP INDEX "MergedCell_sheetId_startRowIndex_endRowIndex_startColIndex__key";

-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
DROP COLUMN "cellId",
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("sheetId", "rowIndex", "colIndex");

-- AlterTable
ALTER TABLE "MergedCell" DROP CONSTRAINT "MergedCell_pkey",
DROP COLUMN "mergedCellId",
ADD CONSTRAINT "MergedCell_pkey" PRIMARY KEY ("sheetId", "startRowIndex", "endRowIndex", "startColIndex", "endColIndex");
