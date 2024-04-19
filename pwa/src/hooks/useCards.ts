import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, ListResponse } from '../components/types';

export default function useCards(
  queryOptions?: Omit<
    Parameters<typeof useQuery<ListResponse<Card>>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await axios.get<ListResponse<Card>>('/admin/api/cards');
      return data;
    },
  });
}
