import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export default function useEnumFood(
  queryOptions?: Omit<
    UseQueryOptions<string[]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['enum', 'food'],
    queryFn: async () => {
      const { data: response } = await axios.get<string[]>('/common/api/lookup/type/food');
      return response;
    },
  });
}
