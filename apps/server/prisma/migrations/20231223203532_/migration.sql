-- CreateTable
CREATE TABLE "Sheets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,

    CONSTRAINT "Sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "sheetId" INTEGER NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "colIndex" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("sheetId","rowIndex","colIndex")
);

-- CreateTable
CREATE TABLE "MergedCells" (
    "sheetId" INTEGER NOT NULL,
    "startRowIndex" INTEGER NOT NULL,
    "endRowIndex" INTEGER NOT NULL,
    "startColIndex" INTEGER NOT NULL,
    "endColIndex" INTEGER NOT NULL,

    CONSTRAINT "MergedCells_pkey" PRIMARY KEY ("sheetId","startRowIndex","endRowIndex","startColIndex","endColIndex")
);

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedCells" ADD CONSTRAINT "MergedCells_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
