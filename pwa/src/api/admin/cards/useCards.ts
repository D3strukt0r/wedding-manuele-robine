import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Card, ListResponse } from '#/components/types';
import { buildListEndpoint, ListOptions } from '#/utils/list.ts';

export default function useCards(
  listOptions?: ListOptions,
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Card>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['cards', listOptions ?? {}],
    queryFn: async () => {
      const url = buildListEndpoint('/admin/api/cards', listOptions);
      const { data: response } = await axios.get<ListResponse<Card>>(url);
      return response;
    },
  });
}
