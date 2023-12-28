import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

import { Button } from '@client/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@client/components/ui/form';
import { Input } from '@client/components/ui/input';
import { getCellsFromDefault } from '@client/lib/utils';
import { useAppStore } from '@client/store';
import { trpc } from '@client/trpc';
import { useEffect, useMemo } from 'react';

const formSchema = z.object({
  sheetName: z.string().min(2, {
    message: 'sheet Name must be at least 2 characters.',
  }),
  creatorName: z.string().min(2, {
    message: 'User name must be at least 2 characters.',
  }),
  creatorEmail: z.string().email(),
});

export function SheetForm() {
  const createSheet = trpc.createSheet.useMutation();
  const updateSheet = trpc.updateSheet.useMutation();
  const deleteSheet = trpc.deleteSheet.useMutation();
  const {
    selectedSheet,
    viewMode,
    sheets,
    updateSheets,
    updateSelectedSheet,
    updateNewSheet,
    updateViewMode,
  } = useAppStore();

  const defaultValues = useMemo(() => {
    if (viewMode === 'VIEWING' && selectedSheet) {
      return {
        sheetName: selectedSheet.sheetName,
        creatorName: selectedSheet.creatorName,
        creatorEmail: selectedSheet.creatorEmail,
      };
    }
    return {
      sheetName: '',
      creatorName: '',
      creatorEmail: '',
    };
  }, [viewMode, selectedSheet]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (viewMode === 'VIEWING' && selectedSheet) {
      updateSheet.mutate(
        {
          id: selectedSheet.id,
          sheetName: values.sheetName,
          creatorName: values.creatorName,
          creatorEmail: values.creatorEmail,
          cells: [],
          mergedCells: [],
        },
        {
          onSuccess: (data) => {
            updateSheets(
              sheets.map((sheet) => {
                if (sheet.id === data.id) {
                  return data;
                }
                return sheet;
              }),
            );
            updateSelectedSheet(data);
            updateViewMode('VIEWING');
          },
        },
      );
      return;
    }
    if (viewMode === 'CREATION') {
      const id = uuidv4();
      createSheet.mutate(
        {
          id,
          sheetName: values.sheetName,
          creatorName: values.creatorName,
          creatorEmail: values.creatorEmail,
          cells: getCellsFromDefault(id),
          mergedCells: [],
        },
        {
          onSuccess: (data) => {
            console.log('>>> data', data);
            updateSheets([...sheets, data]);
            form.reset();

            updateNewSheet(null);
            updateSelectedSheet(data);
            updateViewMode('VIEWING');
          },
        },
      );
    }
  }

  function onDelete() {
    if (selectedSheet) {
      deleteSheet.mutate(
        { sheetId: selectedSheet.id },
        {
          onSuccess: () => {
            updateSheets(
              sheets.filter((sheet) => sheet.id !== selectedSheet?.id),
            );
            onClose();
          },
        },
      );
    }
  }

  function onClose() {
    updateNewSheet(null);
    updateSelectedSheet(null);
    updateViewMode(null);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-[600px]"
      >
        <FormField
          control={form.control}
          name="sheetName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Sheet name</FormLabel>
              <FormControl>
                <Input placeholder="Sheet name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creatorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Creator name</FormLabel>
              <FormControl>
                <Input placeholder="Creator name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="creatorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Creator email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 pt-8">
          {viewMode === 'VIEWING' && (
            <Button type="button" onClick={onDelete} variant={'destructive'}>
              Delete
            </Button>
          )}
          <Button type="button" onClick={onClose} variant={'secondary'}>
            {form.formState.isDirty ? 'Cancel' : 'Close'}
          </Button>
          {form.formState.isDirty && (
            <Button
              type="submit"
              // variant={'secondary'}
              disabled={!form.formState.isValid}
            >
              Save
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
