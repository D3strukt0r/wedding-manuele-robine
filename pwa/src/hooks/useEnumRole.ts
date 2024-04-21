import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export default function useEnumRole(
  queryOptions?: Omit<
    UseQueryOptions<string[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['enum', 'role'],
    queryFn: async () => {
      const { data: response } = await axios.get<string[]>('/common/api/lookup/type/role');
      return response;
    },
  });
}
