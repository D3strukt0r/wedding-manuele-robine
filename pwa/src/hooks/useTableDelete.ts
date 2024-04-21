import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Table } from '../components/types';

export default function useTableDelete(
  id: Table['id'],
  queryOptions?: Omit<
    UseMutationOptions,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/tables/${id}`);
    },
  });
}
