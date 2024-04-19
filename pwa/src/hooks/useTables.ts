import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {ListResponse, Table} from '../components/types.ts';

export default function useTables(
  queryOptions?: Omit<
    Parameters<typeof useQuery<ListResponse<Table>>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await axios.get<ListResponse<Table>>('/admin/api/tables');
      return data;
    },
  });
}
