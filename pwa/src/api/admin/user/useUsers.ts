import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { ListResponse, User } from '#/components/types';

export default function useUsers(
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<User>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['users'],
    queryFn: async () => {
      const { data: response } = await axios.get<ListResponse<User>>('/admin/api/users');
      return response;
    },
  });
}
