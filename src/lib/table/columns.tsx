import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type TaskProps } from '@/hooks/useTaskGetQuery';
import { useTaskDeleteMutation } from '@/hooks/useTaskDeleteMutation';
import { useLogin } from '@/hooks/useLogin';

export const columns: ColumnDef<TaskProps>[] = [
  {
    accessorKey: 'done',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const userId = row.original.userId;
      const { session } = useLogin();

      const isMyTask = session?.user?.id === userId;
      const authorText = isMyTask ? '내가 작성함' : '내가 작성안함';
      const textColor = isMyTask ? 'text-blue-600' : 'text-red-600';

      return <div className={`font-medium ${textColor}`}>{authorText}</div>;
    },
  },
  {
    accessorKey: 'task',
    header: 'Task',
    cell: ({ row }) => {
      return <div>{row.getValue('task')}</div>;
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => <p>{row.getValue('notes')}</p>,
  },
  {
    accessorKey: 'statusName',
    header: 'Status',
    cell: ({ row }) => <p>{row.getValue('statusName')}</p>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const selectedTask = row.original;

      console.log('selectedTask', selectedTask);
      const deleteMutation = useTaskDeleteMutation();

      const onDelete = ({ id }: { id: string }) => {
        deleteMutation.mutate(id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete({ id: selectedTask.id })}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
