import { INestApplication, Injectable } from '@nestjs/common';
import prisma from '@server/prisma';
import {
  SheetCreationInput,
  SheetSchema,
  SheetUpdateInput,
} from '@server/prisma/schema';
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
                    sheetId: createdSheet.id,
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
                    sheetId: createdSheet.id,
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
    updateSheet: this.trpc.procedure
      .input(SheetUpdateInput)
      .mutation(async ({ input }) => {
        const { cells, mergedCells, ...sheet } = input;
        const updatedSheetData = await prisma.$transaction(async (prisma) => {
          const updatedSheet = await prisma.sheet.update({
            data: {
              ...sheet,
              lastEditedAt: new Date(),
            },
            where: {
              id: sheet.id,
            },
          });

          await prisma.cell.deleteMany({
            where: {
              sheetId: sheet.id,
            },
          });

          await prisma.mergedCell.deleteMany({
            where: {
              sheetId: sheet.id,
            },
          });

          const newCells = await Promise.all(
            cells.map(async (cell) => {
              const createdCell = await prisma.cell.create({
                data: cell,
              });
              return createdCell;
            }),
          );

          const newMergedCells = await Promise.all(
            mergedCells.map(async (mergedCell) => {
              const createdMergedCell = await prisma.mergedCell.create({
                data: mergedCell,
              });
              return createdMergedCell;
            }),
          );
          return {
            cells: newCells,
            mergedCells: newMergedCells,
            ...updatedSheet,
          };
        });

        return updatedSheetData;
      }),
    getAllSheets: this.trpc.procedure.query(async () => {
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
    }),
    deleteSheet: this.trpc.procedure
      .input(z.object({ sheetId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        await prisma.$transaction(async (prisma) => {
          await prisma.sheet.delete({
            where: {
              id: input.sheetId,
            },
          });
          await prisma.cell.deleteMany({
            where: {
              sheetId: input.sheetId,
            },
          });
          await prisma.mergedCell.deleteMany({
            where: {
              sheetId: input.sheetId,
            },
          });
        });
        return input.sheetId;
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
