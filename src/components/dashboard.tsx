import { useDebounce } from '@uidotdev/usehooks';

import { DropDownMenu } from '@/components/dropdown';
import { PageSize } from '@/components/pageSize';
import { Search } from '@/components/search';
import { useGetInventoryInspection } from '@/hooks/useGetInventoryInspection';
import { useLogin } from '@/hooks/useLogin';
import { usePagination } from '@/hooks/usePagination';
import { useSearchCondition } from '@/hooks/useSearchCondition';
import { columns } from '@/lib/table/columns';
import { DataTable } from '@/lib/table/data-table';

export function Dashboard() {
  const { onLogoutClick } = useLogin();
  const { pagination, onPaginationChange, onPageSizeChange } = usePagination();
  const { search, onSearchChange } = useSearchCondition();
  const debouncedSearch = useDebounce(search, 300);

  const stockList = useGetInventoryInspection({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    search: debouncedSearch,
  });

  console.log('stockList', stockList.data);

  if (stockList.data)
    return (
      <div className="w-full">
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Tanstack query Search</h1>
            </div>
            <DropDownMenu onLogout={onLogoutClick} />
          </header>
          {/* <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="rounded-lg border p-2 shadow-sm">
              <div className="flex gap-3 p-4">
                <Search search={search} onSearchChange={onSearchChange} />
                <PageSize
                  pageSize={pagination.pageSize}
                  onPageSizeChange={onPageSizeChange}
                />
              </div>
              <DataTable
                data={stockList.data}
                total={stockList.data.count ?? 0}
                columns={columns}
                pagination={pagination}
                onPaginationChange={onPaginationChange}
              />
            </div>
          </main> */}
        </div>
      </div>
    );

  return <div>...Loading</div>;
}
