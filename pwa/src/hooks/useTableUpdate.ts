import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '../components/types';

export default function useTableUpdate(
  id: Table['id'],
  queryOptions?: Omit<
    UseMutationOptions<Omit<Table, 'id'>, DefaultError, Table>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Table, 'id'>) => {
      const { data: response } = await axios.put<Table>(`/admin/api/tables/${id}`, data);
      return response;
    },
  });
}
