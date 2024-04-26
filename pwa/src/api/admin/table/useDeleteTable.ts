import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '#/components/types';

export default function useDeleteTable(
  id: Table['id'],
  queryOptions?: Omit<
    UseMutationOptions,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/tables/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
