import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { ListResponse, Table } from '#/components/types';

export default function useTables(
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['tables'],
    queryFn: async () => {
      const { data: response } = await axios.get<ListResponse<Table>>('/admin/api/tables');
      return response;
    },
  });
}
