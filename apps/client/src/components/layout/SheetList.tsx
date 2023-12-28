import { getCellsFromDefault } from '@client/lib/utils';
import { useAppStore } from '@client/store';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const SheetList: React.FC = () => {
  const { sheets, updateSelectedSheet, updateNewSheet } = useAppStore();

  return (
    <div className="min-w-[320px] bg-gray-900 max-h-full p-8 flex flex-col justify-between">
      {sheets && sheets.length > 0 && (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none text-white opacity-90">
                All Sheets
              </h4>
            </div>
            <Separator className="mb-4 mt-2 bg-white opacity-60" />
            {[...sheets]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((sheet) => (
                <Button
                  key={sheet.id}
                  onClick={() => updateSelectedSheet(sheet)}
                  variant={'secondary'}
                >
                  {sheet.sheetName}
                </Button>
              ))}
          </div>
        </div>
      )}
      <Button
        onClick={() => {
          const id = uuidv4();
          updateNewSheet({
            id,
            sheetName: '',
            creatorName: '',
            creatorEmail: '',
            cells: getCellsFromDefault(id),
            mergedCells: [],
          });
        }}
      >
        Add new Sheet
      </Button>
    </div>
  );
};

export default SheetList;
