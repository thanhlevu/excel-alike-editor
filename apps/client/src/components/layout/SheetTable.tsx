import {
  cn,
  convertCellListToTable,
  convertMergeCellListToTable,
  convertTableToCellList,
  convertTableToMergeCellList,
  unifiedTableCellData,
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
  const { mutate: updateSheetTable } = trpc.updateSheetTable.useMutation();

  const tableData = useMemo(() => {
    return selectedSheet ? convertCellListToTable(selectedSheet.cells) : null;
  }, [selectedSheet]);

  const mergeCells = useMemo(() => {
    if (selectedSheet) {
      return convertMergeCellListToTable(selectedSheet.mergedCells);
    }
    return [];
  }, [selectedSheet]);

  const hyperformulaInstance = useMemo(
    () =>
      HyperFormula.buildEmpty({
        licenseKey: 'internal-use-in-handsontable',
      }),
    [],
  );

  const hotTableComponent = useRef<HotTable | null>(null);

  const handleOnSave = useCallback(() => {
    const curCells = Object.values(
      hyperformulaInstance.getAllSheetsSerialized(),
    ).pop();
    const cellData =
      hotTableComponent.current?.hotInstance?.getData() as RawCellContent[][];
    if (!curCells) return null;

    const unifiedTableCells = unifiedTableCellData(curCells, cellData);
    const newCellList = convertTableToCellList(unifiedTableCells);

    const mergeCellsPlugin: ExtendedMergeCells | undefined =
      hotTableComponent.current?.hotInstance?.getPlugin('mergeCells');
    const curMergeCells =
      mergeCellsPlugin?.mergedCellsCollection?.mergedCells || [];
    const newMergeCellSet = convertTableToMergeCellList(curMergeCells);

    updateSheetTable(
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
    hyperformulaInstance,
    selectedSheet,
    sheets,
    updateSelectedSheet,
    updateSheetTable,
    updateSheets,
  ]);

  const handleOnCancel = useCallback(() => {
    updateSelectedSheet(null);
    updateViewMode(null);
  }, [updateSelectedSheet, updateViewMode]);

  if (!tableData) return null;

  return (
    <div className="w-full h-full p-8" data-testid="sheetTableView">
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
        <Button
          type="button"
          onClick={handleOnCancel}
          variant={'outline'}
          data-testid="table-close-btn"
        >
          Close
        </Button>
        <Button
          type="button"
          onClick={handleOnSave}
          variant={'default'}
          data-testid="table-save-btn"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SheetTable;
