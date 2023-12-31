import { Cell, MergedCell } from '@client/trpc';
import { clsx, type ClassValue } from 'clsx';
import { RawCellContent } from 'hyperformula';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_TABLE_DATA } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDefaultTable = () =>
  DEFAULT_TABLE_DATA.map((row, rowIndex) => {
    return row.map((val, colIndex) => {
      const cell = {
        rowIndex,
        colIndex,
        value: val,
      };

      return cell;
    });
  }).flat(2);

export const convertCellListToTable = (cellList: Cell[]) => {
  const table = cellList.reduce((acc: (string | null)[][], cell) => {
    if (!acc[cell.rowIndex]) {
      acc[cell.rowIndex] = [];
    }
    acc[cell.rowIndex][cell.colIndex] = cell.value || '';
    return acc;
  }, []);

  return table;
};

export const convertTableToCellList = (cells: RawCellContent[][]) => {
  const cellList = cells.reduce(
    (acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        acc.push({
          value: cell ? cell.toString() : '',
          rowIndex,
          colIndex,
        });
      });
      return acc;
    },
    [] as {
      rowIndex: number;
      colIndex: number;
      value: string;
    }[],
  );

  return cellList;
};

export const convertMergeCellListToTable = (mergedCells: MergedCell[]) => {
  return mergedCells.map((cell) => {
    return {
      row: cell.startRowIndex,
      col: cell.startColIndex,
      rowspan: cell.endRowIndex - cell.startRowIndex + 1,
      colspan: cell.endColIndex - cell.startColIndex + 1,
    };
  });
};

export const convertTableToMergeCellList = (
  mergeCells: {
    row: number;
    col: number;
    rowspan: number;
    colspan: number;
  }[],
) => {
  return mergeCells.map((cell) => {
    return {
      startRowIndex: cell.row,
      endRowIndex: cell.row + cell.rowspan - 1,
      startColIndex: cell.col,
      endColIndex: cell.col + cell.colspan - 1,
    };
  });
};

export const unifiedTableCellData = (
  serializedCells: RawCellContent[][],
  cellData: RawCellContent[][],
): RawCellContent[][] => {
  return cellData.map((row, rowIndex) => {
    return row.map((cell, colIndex) => {
      if (!cell) {
        return '';
      } else {
        if (serializedCells[rowIndex][colIndex]?.toString().startsWith('=')) {
          return serializedCells[rowIndex][colIndex];
        }
        return cell;
      }
    });
  });
};
