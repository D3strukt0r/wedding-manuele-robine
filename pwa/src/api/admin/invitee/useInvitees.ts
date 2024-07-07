import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee, ListResponse } from '#/components/types';
import { buildListEndpoint, ListOptions } from '#/utils/list.ts';

export default function useInvitees(
  listOptions?: ListOptions,
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Invitee>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['invitees', listOptions ?? {}],
    queryFn: async () => {
      const url = buildListEndpoint('/admin/api/invitees', listOptions);
      const { data: response } = await axios.get<ListResponse<Invitee>>(url);
      return response;
    },
  });
}
