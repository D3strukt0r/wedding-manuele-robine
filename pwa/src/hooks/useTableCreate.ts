import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '../components/types';

export default function useTableCreate(
  queryOptions?: Omit<
    UseMutationOptions<Table, DefaultError, Omit<Table, 'id'>>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Table, 'id'>) => {
      const { data: response } = await axios.post<Table>('/admin/api/tables', data);
      return response;
    },
  });
}
