import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../components/types';

export default function useUserUpdate(
  id: User['id'],
  queryOptions?: Omit<
    UseMutationOptions<Omit<User, 'id'>, DefaultError, User>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<User, 'id'>) => {
      const { data: response } = await axios.put<User>(`/admin/api/users/${id}`, data);
      return response;
    },
  });
}
