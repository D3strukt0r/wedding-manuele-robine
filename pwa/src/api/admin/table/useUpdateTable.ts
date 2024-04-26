import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '#/components/types';

export default function useUpdateTable(
  id: Table['id'],
  queryOptions?: Omit<
    UseMutationOptions<Table, DefaultError, Omit<Table, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Table, 'id'>) => {
      const { data: response } = await axios.put<Table>(`/admin/api/tables/${id}`, data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
