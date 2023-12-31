import { cn, getDefaultTable } from '@client/lib/utils';
import { useAppStore } from '@client/store';
import React from 'react';
import { Button } from '../ui/button';

const SheetList: React.FC = () => {
  const { sheets, updateSelectedSheet, updateNewSheet, selectedSheet } =
    useAppStore();

  return (
    <div className="min-w-[320px] max-h-full p-8 flex flex-col justify-between ">
      {sheets && sheets.length > 0 && (
        <div className="flex flex-col gap-10">
          <img
            src={'/vahterus-logo.jpg'}
            alt="Vahterus"
            style={{ width: '300px', height: '48px', objectFit: 'cover' }}
          />
          <div className="flex flex-col gap-2">
            <div className="space-y-2">
              <p className="text-sm font-medium leading-none text-gray-500 mb-4 mt-4">
                All sheets
              </p>
            </div>
            {[...sheets]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((sheet) => (
                <Button
                  key={sheet.sheetId}
                  onClick={() => updateSelectedSheet(sheet)}
                  variant={'outline'}
                  className={cn(
                    'justify-start',
                    selectedSheet?.sheetId === sheet.sheetId &&
                      'bg-primary text-white',
                  )}
                >
                  {sheet.sheetName}
                </Button>
              ))}
          </div>
        </div>
      )}
      <Button
        onClick={() => {
          updateNewSheet({
            sheetName: '',
            creatorName: '',
            creatorEmail: '',
            cells: getDefaultTable(),
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
