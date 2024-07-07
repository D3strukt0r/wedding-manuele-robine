import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export enum EnumTypes {
  FOOD = 'food',
  ROLE = 'role',
}

export default function useLookupType(
  type: EnumTypes,
  queryOptions?: Omit<
    UseQueryOptions<[string, ...string[]]>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['enum', type],
    queryFn: async () => {
      const { data: response } = await axios.get<[string, ...string[]]>(`/common/api/lookup/type/${type}`);
      return response;
    },
  });
}
