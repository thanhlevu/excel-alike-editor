import { useAppStore } from '@client/store';
import { Separator } from '@radix-ui/react-separator';
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
        className="w-full border-l border-white border-opacity-10 mt-4"
      >
        <TabsList className="m-8 mb-0">
          <TabsTrigger value="sheetInfoView">Sheet Info</TabsTrigger>
        </TabsList>
        <Separator
          orientation="horizontal"
          className="h-[1px] bg-primary opacity-10"
        />
        <TabsContent value="sheetInfoView">
          <SheetForm />
        </TabsContent>
      </Tabs>
    );

  return (
    <Tabs
      defaultValue="sheetInfoView"
      className="w-full border-l border-white border-opacity-10 mt-4"
    >
      <TabsList className="m-8 mb-0">
        <TabsTrigger value="sheetInfoView">Sheet Info</TabsTrigger>
        <TabsTrigger value="sheetTableView">Sheet Table</TabsTrigger>
      </TabsList>
      <Separator
        orientation="horizontal"
        className="h-[1px] bg-primary opacity-10"
      />
      <TabsContent value="sheetInfoView">
        <SheetForm />
      </TabsContent>
      <TabsContent value="sheetTableView">
        <SheetTable />
      </TabsContent>
    </Tabs>
  );
};

export default SheetView;
