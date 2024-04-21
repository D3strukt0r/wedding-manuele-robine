import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../components/types';

export default function useCard(
  id: Card['id'],
  queryOptions?: Omit<
    UseQueryOptions<Card>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['card', id],
    queryFn: async () => {
      const { data: response } = await axios.get<Card>(`/admin/api/cards/${id}`);
      return response;
    },
  });
}
