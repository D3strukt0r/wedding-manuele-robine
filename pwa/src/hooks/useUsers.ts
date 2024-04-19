import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {ListResponse, User} from '../components/types.ts';

export default function useUsers(
  queryOptions?: Omit<
    Parameters<typeof useQuery<ListResponse<User>>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get<ListResponse<User>>('/admin/api/users');
      return data;
    },
  });
}
