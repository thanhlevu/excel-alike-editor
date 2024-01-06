import { INestApplication, Injectable } from '@nestjs/common';
import prisma from '@server/prisma';
import {
  SheetCreationInput,
  SheetInfoUpdateInput,
  SheetSchema,
  SheetTableUpdateInput,
} from '@server/prisma/schema';
import { TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';
import { TrpcService } from './trpc.service';

@Injectable()
export class TrpcRouter {
  constructor(private readonly trpc: TrpcService) {}
  appRouter = this.trpc.router({
    createSheet: this.trpc.procedure
      .input(SheetCreationInput)
      .output(SheetSchema)
      .mutation(async (opts): Promise<z.infer<typeof SheetSchema>> => {
        const { cells, mergedCells, ...newSheet } = opts.input;
        try {
          const result = await prisma.$transaction(async (prisma) => {
            const createdSheet = await prisma.sheet.create({
              data: {
                ...newSheet,
                createdAt: new Date(),
                lastEditedAt: new Date(),
              },
            });

            const createdCells = await Promise.all(
              cells.map(async (cell) => {
                const createdCell = await prisma.cell.create({
                  data: {
                    ...cell,
                    sheetId: createdSheet.sheetId,
                  },
                });
                return createdCell;
              }),
            );

            const createdMergedCells = await Promise.all(
              mergedCells.map(async (mergedCell) => {
                const createdMergedCell = await prisma.mergedCell.create({
                  data: {
                    ...mergedCell,
                    sheetId: createdSheet.sheetId,
                  },
                });
                return createdMergedCell;
              }),
            );

            return {
              cells: createdCells,
              mergedCells: createdMergedCells,
              ...createdSheet,
            };
          });
          return result;
        } catch (error) {
          console.error('Error creating sheet:', error);
          throw new Error('Failed to create sheet');
        }
      }),
    updateSheetInfo: this.trpc.procedure
      .input(SheetInfoUpdateInput)
      .mutation(async ({ input }) => {
        try {
          const newSheetInfo = input;
          const updatedSheetInfo = await prisma.sheet.update({
            data: {
              ...newSheetInfo,
              lastEditedAt: new Date(),
            },
            where: {
              sheetId: newSheetInfo.sheetId,
            },
          });
          return updatedSheetInfo;
        } catch (error) {
          console.error('Error updating sheet info:', error);
          throw new Error('Failed to update sheet info');
        }
      }),
    updateSheetTable: this.trpc.procedure
      .input(SheetTableUpdateInput)
      .mutation(async ({ input }) => {
        try {
          const { sheetId, newCells, newMergedCells } = input;
          const updatedSheetData = await prisma.$transaction(async (prisma) => {
            await prisma.cell.deleteMany({
              where: {
                sheetId,
              },
            });

            await prisma.mergedCell.deleteMany({
              where: {
                sheetId,
              },
            });

            await prisma.cell.createMany({
              data: newCells.map((cell) => ({
                ...cell,
                sheetId,
              })),
            });

            await prisma.mergedCell.createMany({
              data: newMergedCells.map((mergedCell) => ({
                ...mergedCell,
                sheetId,
              })),
            });

            const updatedSheet = await prisma.sheet.findUnique({
              where: {
                sheetId,
              },
              include: {
                Cells: true,
                MergedCells: true,
              },
            });

            if (!updatedSheet) {
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Sheet not found',
              });
            }
            const { Cells, MergedCells, ...sheet } = updatedSheet;
            return {
              ...sheet,
              cells: Cells || [],
              mergedCells: MergedCells || [],
            };
          });

          return updatedSheetData;
        } catch (error) {
          console.error('Error updating sheet table:', error);
          throw new Error('Failed to update sheet table');
        }
      }),
    getAllSheets: this.trpc.procedure.query(async () => {
      try {
        const sheet = await prisma.sheet.findMany({
          include: {
            Cells: true,
            MergedCells: true,
          },
        });
        return sheet.map(({ Cells, MergedCells, ...sheet }) => ({
          ...sheet,
          cells: Cells,
          mergedCells: MergedCells,
        }));
      } catch (error) {
        console.error('Error getting all sheets:', error);
        throw new Error('Failed to get all sheets');
      }
    }),
    deleteSheet: this.trpc.procedure
      .input(z.object({ sheetId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        try {
          const { sheetId } = input;
          await prisma.$transaction(async (prisma) => {
            await prisma.sheet.delete({
              where: {
                sheetId,
              },
            });
            await prisma.cell.deleteMany({
              where: {
                sheetId,
              },
            });
            await prisma.mergedCell.deleteMany({
              where: {
                sheetId,
              },
            });
          });
          return { sheetId };
        } catch (error) {
          console.error('Error deleting sheet:', error);
          throw new Error('Failed to delete sheet');
        }
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({ router: this.appRouter }),
    );
  }
}

export type AppRouter = TrpcRouter['appRouter'];
