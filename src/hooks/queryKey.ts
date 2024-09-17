type props = {
  page: number;
  size: number;
  search?: string;
};

export const TASK = 'tasks_rls';
export const INVENTORY_INSPECTION = 'tanstack_query_search';

export const taskKeys = {
  all: [{ task: TASK }] as const,
  task: ({ page, size, search }: props) =>
    [
      {
        ...taskKeys.all[0],
        page,
        size,
        search,
      },
    ] as const,
};

export const inventoryInspectionKeys = {
  all: [{ inventoryInspection: INVENTORY_INSPECTION }] as const,
  list: ({ page, size, search }: props) =>
    [
      {
        ...inventoryInspectionKeys.all[0],
        page,
        size,
        search,
      },
    ] as const,
};
