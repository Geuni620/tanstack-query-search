import { useSearchParams } from 'react-router-dom';

export type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export type OnChangeFn<T> = (updaterOrValue: T | ((prevState: T) => T)) => void;

export const usePagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagination: Pagination = {
    pageIndex: parseInt(searchParams.get('page') || '1', 10) - 1,
    pageSize: parseInt(searchParams.get('size') || '20', 10),
  };

  const onPaginationChange: OnChangeFn<Pagination> = (updaterOrValue) => {
    setSearchParams((prev) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;

      prev.set('page', (newPagination.pageIndex + 1).toString()); // URL에는 1부터 시작하는 페이지 번호 저장
      prev.set('size', newPagination.pageSize.toString());
      return prev;
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    setSearchParams((prev) => {
      prev.set('size', pageSize.toString());
      prev.set('page', '1');

      return prev;
    });
  };

  return {
    pagination,
    onPaginationChange: onPaginationChange,
    onPageSizeChange: onPageSizeChange,
  };
};
