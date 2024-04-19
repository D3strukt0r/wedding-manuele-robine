import {useQuery} from '@tanstack/react-query';
import axios from 'axios';

export default function useEnumFood(
  queryOptions?: Omit<
    Parameters<typeof useQuery<string[]>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['enum', 'food'],
    queryFn: async () => {
      const { data } = await axios.get<string[]>(`/common/api/lookup/type/food`);
      return data;
    },
  });
}
