import { Sheet, SheetCreationInput } from '@client/trpc';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface StoreState {
  sheets: Sheet[];
  updateSheets: (sheets: Sheet[]) => void;

  newSheet: Sheet | null;
  updateNewSheet: (sheet: SheetCreationInput | null) => void;

  selectedSheet: Sheet | null;
  updateSelectedSheet: (sheet: Sheet | null) => void;

  viewMode: 'CREATION' | 'VIEWING' | null;
  updateViewMode: (mode: 'CREATION' | 'VIEWING' | null) => void;
}

export const useAppStore = create<StoreState>()(
  immer(
    devtools(
      persist(
        (set) => ({
          sheets: [],
          selectedSheet: null,
          newSheet: null,
          viewMode: null,
          updateSheets: (sheets: Sheet[]) =>
            set(
              () => ({
                sheets,
              }),
              false,
              'updateSheets',
            ),
          updateSelectedSheet: (sheet: Sheet | null) =>
            set(
              () => {
                if (sheet === null) return { selectedSheet: null };
                return {
                  selectedSheet: sheet,
                  viewMode: 'VIEWING',
                  newSheet: null,
                };
              },
              false,
              'updateSelectedSheet',
            ),
          updateNewSheet: (sheet: SheetCreationInput | null) =>
            set(
              () => {
                if (sheet === null) return { newSheet: null };
                return {
                  newSheet: sheet,
                  viewMode: 'CREATION',
                  selectedSheet: null,
                };
              },
              false,
              'updateNewSheet',
            ),
          updateViewMode: (mode: 'CREATION' | 'VIEWING' | null) =>
            set(
              () => ({
                viewMode: mode,
              }),
              false,
              'updateViewMode',
            ),
        }),
        {
          name: 'excel-alike-editor',
          partialize: () => ({}),
        },
      ),
    ),
  ),
);
