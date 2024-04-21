import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../components/types';

export default function useCardDelete(
  id: Card['id'],
  queryOptions?: Omit<
    UseMutationOptions,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/cards/${id}`);
    },
  });
}
