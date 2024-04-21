import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../components/types';

export default function useCardUpdate(
  id: Card['id'],
  queryOptions?: Omit<
    UseMutationOptions<Omit<Card, 'id'>, DefaultError, Card>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Card, 'id'>) => {
      const { data: response } = await axios.put<Card>(`/admin/api/cards/${id}`, data);
      return response;
    },
  });
}
