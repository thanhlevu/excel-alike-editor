import { useAppStore } from '@client/store';
import { trpc } from '@client/trpc';
import { useEffect } from 'react';
import SheetList from './SheetList';
import SheetView from './SheetView';

const Dashboard: React.FC = () => {
  const { data: sheets } = trpc.getAllSheets.useQuery();
  const { updateSheets } = useAppStore();

  useEffect(() => {
    if (sheets) {
      updateSheets(sheets);
    }
  }, [sheets, updateSheets]);

  return (
    <div className="w-full h-screen flex">
      <SheetList />
      <SheetView />
    </div>
  );
};

export default Dashboard;
