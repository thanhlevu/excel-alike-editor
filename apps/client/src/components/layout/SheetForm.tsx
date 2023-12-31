import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { getDefaultTable } from '@client/lib/utils';
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
  const updateSheetInfo = trpc.updateSheetInfo.useMutation();
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
      updateSheetInfo.mutate(
        {
          sheetId: selectedSheet.sheetId,
          sheetName: values.sheetName,
          creatorName: values.creatorName,
          creatorEmail: values.creatorEmail,
        },
        {
          onSuccess: (data) => {
            updateSheets(
              sheets.map((sheet) => {
                if (sheet.sheetId === data.sheetId) {
                  return { ...sheet, ...data };
                }
                return sheet;
              }),
            );
            updateSelectedSheet({ ...selectedSheet, ...data });
            updateViewMode('VIEWING');
          },
        },
      );
      return;
    }
    if (viewMode === 'CREATION') {
      createSheet.mutate(
        {
          sheetName: values.sheetName,
          creatorName: values.creatorName,
          creatorEmail: values.creatorEmail,
          cells: getDefaultTable(),
          mergedCells: [],
        },
        {
          onSuccess: (data) => {
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
        { sheetId: selectedSheet.sheetId },
        {
          onSuccess: () => {
            updateSheets(
              sheets.filter(
                (sheet) => sheet.sheetId !== selectedSheet?.sheetId,
              ),
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
