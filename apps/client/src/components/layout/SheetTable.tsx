import { DEFAULT_TABLE_DATA } from '@client/lib/constants';
import {
  cn,
  convertCellListToTable,
  convertMergeCellListToTable,
  convertTableToCellList,
  convertTableToMergeCellList,
} from '@client/lib/utils';
import { useAppStore } from '@client/store';
import { trpc } from '@client/trpc';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { MergeCells } from 'handsontable/plugins';
import { registerAllModules } from 'handsontable/registry';
import { HyperFormula, RawCellContent } from 'hyperformula';
import React, { useCallback, useMemo, useRef } from 'react';
import { Button } from '../ui/button';

registerAllModules();
interface ExtendedMergeCells extends MergeCells {
  mergedCellsCollection?: {
    mergedCells: {
      row: number;
      col: number;
      rowspan: number;
      colspan: number;
    }[];
  };
}

const SheetTable: React.FC = () => {
  const {
    selectedSheet,
    updateSelectedSheet,
    sheets,
    updateSheets,
    updateViewMode,
  } = useAppStore();
  const updateSheetTable = trpc.updateSheetTable.useMutation();

  const defaultDataTable = useMemo(() => DEFAULT_TABLE_DATA, []);

  const tableData = useMemo(() => {
    if (selectedSheet) {
      return convertCellListToTable(selectedSheet.cells);
    }
    return defaultDataTable;
  }, [selectedSheet, defaultDataTable]);

  const mergeCells = useMemo(() => {
    if (selectedSheet) {
      return convertMergeCellListToTable(selectedSheet.mergedCells);
    }
    return [];
  }, [selectedSheet]);

  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  const hotTableComponent = useRef<HotTable | null>(null);

  const handleOnSave = useCallback(() => {
    const curCells =
      hotTableComponent.current?.hotInstance?.getData() as RawCellContent[][];
    const newCellList = convertTableToCellList(curCells);

    const mergeCellsPlugin: ExtendedMergeCells | undefined =
      hotTableComponent.current?.hotInstance?.getPlugin('mergeCells');
    const curMergeCells =
      mergeCellsPlugin?.mergedCellsCollection?.mergedCells || [];
    const newMergeCellSet = convertTableToMergeCellList(curMergeCells);

    updateSheetTable.mutate(
      {
        sheetId: selectedSheet!.sheetId,
        newCells: newCellList,
        newMergedCells: newMergeCellSet,
      },
      {
        onSuccess: (data) => {
          updateSelectedSheet(data);
          updateSheets(
            sheets.map((sheet) => {
              if (sheet.sheetId === data.sheetId) {
                return data;
              }
              return sheet;
            }),
          );
          hotTableComponent.current?.hotInstance?.loadData(
            convertCellListToTable(data.cells),
          );
        },
      },
    );
  }, [
    selectedSheet,
    sheets,
    updateSelectedSheet,
    updateSheetTable,
    updateSheets,
  ]);

  const handleOnCancel = () => {
    updateSelectedSheet(null);
    updateViewMode(null);
  };

  return (
    <div className="w-full h-full p-8">
      <HotTable
        ref={hotTableComponent}
        formulas={{
          engine: hyperformulaInstance,
        }}
        data={tableData}
        colWidths={78}
        rowHeights={24}
        rowHeaders={true}
        colHeaders={true}
        manualColumnMove={true}
        manualRowMove={true}
        contextMenu={true}
        mergeCells={mergeCells}
        renderer={'html'}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className={cn('flex gap-4 pt-8')}>
        <Button type="button" onClick={handleOnCancel} variant={'outline'}>
          Close
        </Button>
        <Button type="button" onClick={handleOnSave} variant={'default'}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default SheetTable;
