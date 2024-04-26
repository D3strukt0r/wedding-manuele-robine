import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card, ListResponse } from '#/components/types';

export default function useCards(
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Card>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['cards'],
    queryFn: async () => {
      const { data: response } = await axios.get<ListResponse<Card>>('/admin/api/cards');
      return response;
    },
  });
}
