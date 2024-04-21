import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../components/types';

export default function useCardCreate(
  queryOptions?: Omit<
    UseMutationOptions<Omit<Card, 'id'>, DefaultError, Card>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Card, 'id'>) => {
      const { data: response } = await axios.post<Card>('/admin/api/cards', data);
      return response;
    },
  });
}
