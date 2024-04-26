import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '#/components/types';

export default function useUpdateUser(
  id: User['id'],
  queryOptions?: Omit<
    UseMutationOptions<User, DefaultError, Omit<User, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<User, 'id'>) => {
      const { data: response } = await axios.put<User>(`/admin/api/users/${id}`, data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
