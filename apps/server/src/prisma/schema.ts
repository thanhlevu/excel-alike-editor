import { z } from 'zod';

export const CellSchema = z.object({
  sheetId: z.string().uuid(),
  rowIndex: z.number(),
  colIndex: z.number(),
  value: z.string(),
});

export const MergedCellsSchema = z.object({
  sheetId: z.string().uuid(),
  startRowIndex: z.number(),
  endRowIndex: z.number(),
  startColIndex: z.number(),
  endColIndex: z.number(),
});

export const SheetSchema = z.object({
  id: z.string().uuid(),
  sheetName: z.string(),
  createdAt: z.date(),
  lastEditedAt: z.date(),
  creatorName: z.string(),
  creatorEmail: z.string(),
  cells: z.array(CellSchema),
  mergedCells: z.array(MergedCellsSchema),
});

export const SheetCreationInput = z.object({
  id: z.string().uuid(),
  sheetName: z.string(),
  creatorName: z.string(),
  creatorEmail: z.string(),
  cells: z.array(CellSchema),
  mergedCells: z.array(MergedCellsSchema),
});

export const SheetUpdateInput = z.object({
  id: z.string().uuid(),
  sheetName: z.string(),
  creatorName: z.string(),
  creatorEmail: z.string(),
  cells: z.array(CellSchema),
  mergedCells: z.array(MergedCellsSchema),
});
