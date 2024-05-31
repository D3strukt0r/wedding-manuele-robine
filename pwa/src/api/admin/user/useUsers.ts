import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';
import { ListResponse, User } from '#/components/types';
import { buildListEndpoint, ListOptions } from '#/utils/list.ts';

export default function useUsers(
  listOptions?: ListOptions,
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    placeholderData: keepPreviousData,
    ...(queryOptions ?? {}),
    queryKey: ['users', listOptions ?? {}],
    queryFn: async () => {
      const url = buildListEndpoint('/admin/api/users', listOptions);
      const { data: response } = await axios.get<ListResponse<User>>(url);
      return response;
    },
  });
}
