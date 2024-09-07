import { type ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import type { InventoryInspectionResponse } from '@/hooks/useGetInventoryInspection';

export const columns: ColumnDef<InventoryInspectionResponse['data'][number]>[] =
  [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="모두 선택"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="행 선택"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'clientName',
      header: '화주사명',
    },
    {
      accessorKey: 'inspectionCode',
      header: '점검 코드',
    },
    {
      accessorKey: 'inspectionCondition',
      header: '점검 조건',
    },
    {
      accessorKey: 'inspectionName',
      header: '점검명',
    },
    {
      accessorKey: 'quantity',
      header: '수량',
    },
    {
      accessorKey: 'registrant',
      header: '등록자',
    },
    {
      accessorKey: 'registrationDate',
      header: '등록일',
      cell: ({ row }) => {
        const date = new Date(row.getValue('registrationDate'));

        return date.toLocaleDateString('ko-KR');
      },
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'status',
      header: '상태',
    },
  ];
