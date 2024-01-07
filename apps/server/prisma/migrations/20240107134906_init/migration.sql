-- CreateTable
CREATE TABLE "Sheet" (
    "sheetId" TEXT NOT NULL,
    "sheetName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "lastEditedAt" TIMESTAMP(3) NOT NULL,
    "creatorName" TEXT NOT NULL,
    "creatorEmail" TEXT NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("sheetId")
);

-- CreateTable
CREATE TABLE "Cell" (
    "sheetId" TEXT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "colIndex" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("sheetId","rowIndex","colIndex")
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
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergedCell" ADD CONSTRAINT "MergedCell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("sheetId") ON DELETE CASCADE ON UPDATE CASCADE;
