import { api } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
  const { queryClient } = await parent();

  const tableId = parseInt(params.tableId);

  await queryClient.prefetchQuery({
    queryKey: ['table', tableId],
    queryFn: () => api.tables.show(tableId),
  });

  return { tableId };
}
