/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `MergedCell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sheet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Sheet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sheetId,rowIndex,colIndex]` on the table `Cell` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sheetId,startRowIndex,endRowIndex,startColIndex,endColIndex]` on the table `MergedCell` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cellId` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mergedCellId` to the `MergedCell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sheetId` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "MergedCell" DROP CONSTRAINT "MergedCell_sheetId_fkey";

-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
ADD COLUMN     "cellId" TEXT NOT NULL,
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("cellId");

-- AlterTable
ALTER TABLE "MergedCell" DROP CONSTRAINT "MergedCell_pkey",
ADD COLUMN     "mergedCellId" TEXT NOT NULL,
ADD CONSTRAINT "MergedCell_pkey" PRIMARY KEY ("mergedCellId");

-- AlterTable
ALTER TABLE "Sheet" DROP CONSTRAINT "Sheet_pkey",
DROP COLUMN "id",
ADD COLUMN     "sheetId" TEXT NOT NULL,
ADD CONSTRAINT "Sheet_pkey" PRIMARY KEY ("sheetId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheetId_rowIndex_colIndex_key" ON "Cell"("sheetId", "rowIndex", "colIndex");

-- CreateIndex
CREATE UNIQUE INDEX "MergedCell_sheetId_startRowIndex_endRowIndex_startColIndex__key" ON "MergedCell"("sheetId", "startRowIndex", "endRowIndex", "startColIndex", "endColIndex");

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedCell" ADD CONSTRAINT "MergedCell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE RESTRICT ON UPDATE CASCADE;
