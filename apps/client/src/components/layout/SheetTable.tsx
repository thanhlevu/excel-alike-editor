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
import { HyperFormula } from 'hyperformula';
import React, { useMemo, useRef } from 'react';
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
  const { selectedSheet, updateSelectedSheet, sheets, updateSheets } =
    useAppStore();
  const updateSheetTable = trpc.updateSheetTable.useMutation();

  const [isTableChanged, setIsTableChanged] = React.useState(false);
  const defaultDataTable = useMemo(() => DEFAULT_TABLE_DATA, []);

  const data = useMemo(() => {
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

  const handleDataChange = () => {
    if (hotTableComponent.current) {
      setIsTableChanged(true);
    }
  };

  const handleOnSave = async () => {
    const curCells = hotTableComponent.current?.hotInstance?.getData() as (
      | string
      | null
    )[][];
    const newCellSet = convertTableToCellList(curCells);

    const mergeCellsPlugin: ExtendedMergeCells | undefined =
      hotTableComponent.current?.hotInstance?.getPlugin('mergeCells');
    const curMergeCells =
      mergeCellsPlugin?.mergedCellsCollection?.mergedCells || [];
    const newMergeCellSet = convertTableToMergeCellList(curMergeCells);

    await updateSheetTable.mutate(
      {
        sheetId: selectedSheet!.sheetId,
        newCells: newCellSet,
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
        },
      },
    );
  };

  const handleOnCancel = () => {};

  return (
    <div className="w-full h-full ">
      <HotTable
        ref={hotTableComponent}
        formulas={{
          engine: hyperformulaInstance,
        }}
        data={data}
        colWidths={78}
        rowHeights={24}
        rowHeaders={true}
        colHeaders={true}
        manualColumnMove={true}
        manualRowMove={true}
        contextMenu={true}
        mergeCells={mergeCells}
        afterChange={() => {
          // observe changes on cell level
          handleDataChange();
        }}
        afterModifyTransformStart={() => {
          handleDataChange();
        }}
        afterCreateRow={() => {
          handleDataChange();
        }}
        afterCreateCol={() => {
          handleDataChange();
        }}
        afterRemoveRow={() => {
          handleDataChange();
        }}
        afterRemoveCol={() => {
          handleDataChange();
        }}
        afterColumnMove={() => {
          handleDataChange();
        }}
        afterRowMove={() => {
          handleDataChange();
        }}
        afterMergeCells={() => {
          handleDataChange();
        }}
        afterUnmergeCells={() => {
          handleDataChange();
        }}
        renderer={'html'}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className={cn('flex gap-4 pt-8', !isTableChanged && '')}>
        <Button type="button" onClick={handleOnCancel} variant={'outline'}>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={async () => await handleOnSave()}
          variant={'secondary'}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SheetTable;
