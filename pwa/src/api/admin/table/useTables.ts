import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { ListResponse, Table } from '#/components/types';
import { buildListEndpoint, ListOptions } from '#/utils/list.ts';

export default function useTables(
  listOptions?: ListOptions,
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['tables', listOptions ?? {}],
    queryFn: async () => {
      const url = buildListEndpoint('/admin/api/tables', listOptions);
      const { data: response } = await axios.get<ListResponse<Table>>(url);
      return response;
    },
  });
}
