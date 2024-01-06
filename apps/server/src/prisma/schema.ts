import { z } from 'zod';

export const CellSchema = z.object({
  sheetId: z.string().uuid(),
  rowIndex: z.number().min(0),
  colIndex: z.number().min(0),
  value: z.string().nullable(),
});

export const MergedCellsSchema = z.object({
  sheetId: z.string().uuid(),
  startRowIndex: z.number().min(0),
  endRowIndex: z.number().min(0),
  startColIndex: z.number().min(0),
  endColIndex: z.number().min(0),
});

export const SheetSchema = z.object({
  sheetId: z.string().uuid(),
  sheetName: z.string().min(3),
  createdAt: z.date(),
  lastEditedAt: z.date(),
  creatorName: z.string().min(3),
  creatorEmail: z.string().email(),
  cells: z.array(CellSchema),
  mergedCells: z.array(MergedCellsSchema),
});

export const SheetCreationInput = z.object({
  sheetName: z.string().min(3),
  creatorName: z.string().min(3),
  creatorEmail: z.string().email(),
  cells: z.array(CellSchema.omit({ sheetId: true })),
  mergedCells: z.array(MergedCellsSchema.omit({ sheetId: true })),
});

export const SheetInfoUpdateInput = z.object({
  sheetId: z.string().uuid(),
  sheetName: z.string().min(3),
  creatorName: z.string().min(3),
  creatorEmail: z.string().email(),
});

export const SheetTableUpdateInput = z.object({
  sheetId: z.string().uuid(),
  newCells: z.array(CellSchema.omit({ sheetId: true })),
  newMergedCells: z.array(MergedCellsSchema.omit({ sheetId: true })),
});
