import {
  keepPreviousData,
  QueryFunctionContext,
  useQuery,
} from '@tanstack/react-query';
import camelcaseKeys from 'camelcase-keys';

import {
  INVENTORY_INSPECTION,
  inventoryInspectionKeys,
} from '@/hooks/queryKey';
import { useQueryParams } from '@/hooks/useQueryParams';
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

const getInventoryInspection = async ({
  queryKey: [{ page, size, search }],
}: QueryFunctionContext<
  ReturnType<(typeof inventoryInspectionKeys)['list']>
>): Promise<InventoryInspectionResponse> => {
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
  const [{ page, size, search }] = useQueryParams();

  return useQuery({
    queryKey: inventoryInspectionKeys.list({
      page,
      size,
      search,
    }),
    queryFn: getInventoryInspection,
    placeholderData: keepPreviousData,
  });
};
