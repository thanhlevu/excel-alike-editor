import { DEFAULT_TABLE_DATA } from '@client/lib/constants';
import { useAppStore } from '@client/store';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { registerAllModules } from 'handsontable/registry';
import React, { useMemo } from 'react';

registerAllModules();

const SheetTable: React.FC = () => {
  const { selectedSheet } = useAppStore();

  const defaultDataTable = useMemo(() => DEFAULT_TABLE_DATA, []);

  const data = useMemo(() => {
    if (selectedSheet) {
      return selectedSheet.cells.reduce((acc: (string | null)[][], cell) => {
        if (!acc[cell.rowIndex]) {
          acc[cell.rowIndex] = [];
        }
        acc[cell.rowIndex][cell.colIndex] = cell.value;
        return acc;
      }, []);
    }
    return defaultDataTable;
  }, [selectedSheet, defaultDataTable]);

  const mergeCells = useMemo(() => {
    if (selectedSheet) {
      return selectedSheet.mergedCells.map((cell) => {
        return {
          row: cell.startRowIndex,
          col: cell.startColIndex,
          rowspan: cell.endRowIndex - cell.startRowIndex + 1,
          colspan: cell.endColIndex - cell.startColIndex + 1,
        };
      });
    }
    return [];
  }, [selectedSheet]);

  return (
    <div className="max-w-[400px] h-full">
      <HotTable
        data={data}
        height={320}
        colWidths={47}
        rowHeaders={true}
        colHeaders={true}
        manualColumnMove={true}
        manualRowMove={true}
        contextMenu={true}
        mergeCells={mergeCells}
        afterChange={(changes) => {
          console.log('>>> changes', changes);
        }}
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
};

export default SheetTable;
