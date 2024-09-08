import { keepPreviousData, useQuery } from '@tanstack/react-query';
import camelcaseKeys from 'camelcase-keys';
import { useSearchParams } from 'react-router-dom';

import {
  INVENTORY_INSPECTION,
  inventoryInspectionKeys,
} from '@/hooks/queryKey';
import type { Database } from '@/types/supabase';
import type { SnakeToCamel } from '@/types/utils';
import { supabase } from '@/utils/supabase';

type InventoryInspection =
  Database['public']['Tables']['tanstack_query_search']['Row'];
type InventoryInspectionCamelCase = {
  [K in keyof InventoryInspection as SnakeToCamel<
    K & string
  >]: InventoryInspection[K];
};

export type InventoryInspectionResponse = {
  data: InventoryInspectionCamelCase[];
  count: number | null;
};

type Params = {
  queryKey: ReturnType<(typeof inventoryInspectionKeys)['list']>;
  search: string;
};

const getInventoryInspection = async ({
  queryKey,
  search,
}: Params): Promise<InventoryInspectionResponse> => {
  const [{ page, size }] = queryKey;
  console.log('search', search);

  const start = page * size;
  const end = start + size - 1;
  const query = supabase
    .from(INVENTORY_INSPECTION)
    .select('*', { count: 'exact' })
    .range(start, end)
    .order('id', { ascending: true });

  if (search?.trim()) {
    const searchFields = ['client_name', 'inspection_code', 'inspection_name'];
    query.or(
      searchFields.map((field) => `${field}.ilike.%${search}%`).join(','),
    );
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data.map((item) => camelcaseKeys(item, { deep: true })),
    count,
  };
};

export const useGetInventoryInspection = () => {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10) - 1;
  const size = parseInt(searchParams.get('size') || '20', 10);
  const search = searchParams.get('search') || '';

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: inventoryInspectionKeys.list({
      page,
      size,
    }),
    queryFn: ({ queryKey }) => getInventoryInspection({ queryKey, search }),
    placeholderData: keepPreviousData,
    enabled: false,
  });
};
