import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../components/types';

export default function useCardUpdate(
  id: Card['id'],
  queryOptions?: Omit<
    UseMutationOptions<Card, DefaultError, Omit<Card, 'id'>>,
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
