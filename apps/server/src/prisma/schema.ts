import { z } from 'zod';

export const CellSchema = z.object({
  sheetId: z.string().uuid(),
  rowIndex: z.number(),
  colIndex: z.number(),
  value: z.string().nullable(),
});

export const MergedCellsSchema = z.object({
  sheetId: z.string().uuid(),
  startRowIndex: z.number(),
  endRowIndex: z.number(),
  startColIndex: z.number(),
  endColIndex: z.number(),
});

export const SheetSchema = z.object({
  sheetId: z.string().uuid(),
  sheetName: z.string(),
  createdAt: z.date(),
  lastEditedAt: z.date(),
  creatorName: z.string(),
  creatorEmail: z.string(),
  cells: z.array(CellSchema),
  mergedCells: z.array(MergedCellsSchema),
});

export const SheetCreationInput = z.object({
  sheetName: z.string(),
  creatorName: z.string(),
  creatorEmail: z.string(),
  cells: z.array(CellSchema.omit({ sheetId: true })),
  mergedCells: z.array(MergedCellsSchema.omit({ sheetId: true })),
});

export const SheetInfoUpdateInput = z.object({
  sheetId: z.string().uuid(),
  sheetName: z.string(),
  creatorName: z.string(),
  creatorEmail: z.string(),
});

export const SheetTableUpdateInput = z.object({
  sheetId: z.string().uuid(),
  newCells: z.array(CellSchema.omit({ sheetId: true })),
  newMergedCells: z.array(MergedCellsSchema.omit({ sheetId: true })),
});
