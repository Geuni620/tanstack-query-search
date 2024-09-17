import { useSearchParams } from 'react-router-dom';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10) - 1;
  const size = parseInt(searchParams.get('size') || '20', 10);
  const search = searchParams.get('search') || '';

  const queryParams = {
    page,
    size,
    search,
  };

  return [queryParams, setSearchParams] as const;
};
