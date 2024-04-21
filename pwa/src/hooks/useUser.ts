import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../components/types';

export default function useUser(
  id: User['id'],
  queryOptions?: Omit<
    UseQueryOptions<User>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['user', id],
    queryFn: async () => {
      const { data: response } = await axios.get<User>(`/admin/api/users/${id}`);
      return response;
    },
  });
}
