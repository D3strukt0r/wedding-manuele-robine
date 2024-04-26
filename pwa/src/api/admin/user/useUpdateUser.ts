import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SymfonyValidationFailedResponse, User } from '#/components/types';

export default function useUpdateUser(
  id: User['id'],
  queryOptions?: Omit<
    UseMutationOptions<User, AxiosError<SymfonyValidationFailedResponse>, Omit<User, 'id'>>,
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
