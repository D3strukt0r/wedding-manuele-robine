import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Card, SymfonyValidationFailedResponse } from '#/components/types';

export default function useDeleteCard(
  id: Card['id'],
  queryOptions?: Omit<
    UseMutationOptions<unknown, AxiosError<SymfonyValidationFailedResponse>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/cards/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
