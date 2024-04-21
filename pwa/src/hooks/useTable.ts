import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '../components/types';

export default function useTable(
  id: Table['id'],
  queryOptions?: Omit<
    UseQueryOptions<Table>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['table', id],
    queryFn: async () => {
      const { data: response } = await axios.get<Table>(`/admin/api/tables/${id}`);
      return response;
    },
  });
}
