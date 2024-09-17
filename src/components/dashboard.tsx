import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import { HelpCircle } from 'lucide-react';

import { DropDownMenu } from '@/components/dropdown';
import { PageSize } from '@/components/pageSize';
import { Search } from '@/components/search';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useGetInventoryInspection } from '@/hooks/useGetInventoryInspection';
import { useLogin } from '@/hooks/useLogin';
import { useQueryParams } from '@/hooks/useQueryParams';
import { columns } from '@/lib/table/columns';
import { DataTable } from '@/lib/table/data-table';

export function Dashboard() {
  const { onLogoutClick } = useLogin();
  const stockList = useGetInventoryInspection();
  const [queryParams, setQueryParams] = useQueryParams();
  const { page, size, search } = queryParams;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSearch = formData.get('search')?.toString() || '';

    setQueryParams((prevParams) => {
      prevParams.set('page', '1');

      if (newSearch) {
        prevParams.set('search', newSearch);
      } else {
        prevParams.delete('search');
      }

      return prevParams;
    });
  };

  const onPageSizeChange = (newPageSize: number) => {
    setQueryParams((prevParams) => {
      prevParams.set('size', newPageSize.toString());
      prevParams.set('page', '1');
      return prevParams;
    });
  };

  const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setQueryParams((prevParams) => {
      const currentPagination = { pageIndex: page, pageSize: size };

      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(currentPagination)
          : updaterOrValue;

      prevParams.set('page', (newPagination.pageIndex + 1).toString());
      prevParams.set('size', newPagination.pageSize.toString());

      return prevParams;
    });
  };

  if (stockList.data)
    return (
      <div className="w-full">
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Tanstack Query Search</h1>
            </div>
            <DropDownMenu onLogout={onLogoutClick} />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="rounded-lg border p-2 shadow-sm">
              <div className="flex justify-end gap-3 p-4">
                <HoverCard>
                  <HoverCardTrigger>
                    <form onSubmit={onSubmit}>
                      <Search search={search} />
                    </form>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                      <div>
                        <h4 className="mb-1 text-sm font-semibold">
                          검색 도움말
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          화주사명, 점검 코드, 점검명으로 검색이 가능해요.
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <PageSize pageSize={size} onPageSizeChange={onPageSizeChange} />
              </div>
              <DataTable
                data={stockList.data?.data}
                total={stockList.data?.count ?? 0}
                columns={columns}
                pagination={{ pageIndex: page, pageSize: size }}
                onPaginationChange={onPaginationChange}
              />
            </div>
          </main>
        </div>
      </div>
    );

  return <div>...Loading</div>;
}
