import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '#/components/types';

export default function useCreateCard(
  queryOptions?: Omit<
    UseMutationOptions<Card, DefaultError, Omit<Card, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Card, 'id'>) => {
      const { data: response } = await axios.post<Card>('/admin/api/cards', data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
