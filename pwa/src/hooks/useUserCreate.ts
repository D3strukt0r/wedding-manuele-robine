import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../components/types';

export default function useUserCreate(
  queryOptions?: Omit<
    UseMutationOptions<Omit<User, 'id'>, DefaultError, User>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<User, 'id'>) => {
      const { data: response } = await axios.post<User>('/admin/api/users', data);
      return response;
    },
  });
}
