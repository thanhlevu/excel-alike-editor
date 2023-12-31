-- DropForeignKey
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_sheetId_fkey";

-- DropForeignKey
ALTER TABLE "MergedCell" DROP CONSTRAINT "MergedCell_sheetId_fkey";

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedCell" ADD CONSTRAINT "MergedCell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE CASCADE ON UPDATE CASCADE;
