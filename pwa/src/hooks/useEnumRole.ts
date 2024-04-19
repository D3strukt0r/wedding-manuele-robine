import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useEnumRole(
  queryOptions?: Omit<
    Parameters<typeof useQuery<string[]>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['enum', 'role'],
    queryFn: async () => {
      const { data } = await axios.get<string[]>('/common/api/lookup/type/role');
      return data;
    },
  });
}
