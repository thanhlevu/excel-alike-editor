import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_TABLE_DATA } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCellsFromDefault = (sheetId: string) =>
  DEFAULT_TABLE_DATA.map((row, rowIndex) => {
    return row.map((val, colIndex) => {
      return {
        sheetId: sheetId,
        rowIndex,
        colIndex,
        value: val,
      };
    });
  }).flat(2);
