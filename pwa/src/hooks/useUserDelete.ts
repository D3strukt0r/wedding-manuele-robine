import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../components/types';

export default function useUserDelete(
  id: User['id'],
  queryOptions?: Omit<
    UseMutationOptions,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/users/${id}`);
    },
  });
}
