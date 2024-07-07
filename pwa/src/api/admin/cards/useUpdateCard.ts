import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Card, SymfonyValidationFailedResponse } from '#/components/types';

export default function useUpdateCard(
  id: Card['id'],
  queryOptions?: Omit<
    UseMutationOptions<Card, AxiosError<SymfonyValidationFailedResponse>, Omit<Card, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Card, 'id'>) => {
      const { data: response } = await axios.put<Card>(`/admin/api/cards/${id}`, data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
