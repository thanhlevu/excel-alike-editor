import { useAppStore } from '@client/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { SheetForm } from './SheetForm';
import SheetTable from './SheetTable';

const SheetView: React.FC = () => {
  const { viewMode } = useAppStore();

  if (!viewMode) return <div className="w-full" />;

  if (viewMode === 'CREATION')
    return (
      <Tabs
        defaultValue="sheetInfoView"
        className="w-full p-8 border-l border-white border-opacity-10 bg-gray-900"
      >
        <TabsList>
          <TabsTrigger value="sheetInfoView">Sheet Info</TabsTrigger>
        </TabsList>
        <TabsContent value="sheetInfoView" className="pt-8">
          <SheetForm />
        </TabsContent>
      </Tabs>
    );

  return (
    <Tabs
      defaultValue="sheetInfoView"
      className="w-full p-8 border-l border-white border-opacity-10 bg-gray-900"
    >
      <TabsList>
        <TabsTrigger value="sheetInfoView">Sheet Info</TabsTrigger>
        <TabsTrigger value="sheetTableView">Sheet Table</TabsTrigger>
      </TabsList>
      <TabsContent value="sheetInfoView" className="pt-8">
        <SheetForm />
      </TabsContent>
      <TabsContent value="sheetTableView" className="pt-8">
        <SheetTable />
      </TabsContent>
    </Tabs>
  );
};

export default SheetView;
