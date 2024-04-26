import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee, ListResponse } from '#/components/types';

export default function useInvitees(
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Invitee>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['invitees'],
    queryFn: async () => {
      const { data: response } = await axios.get<ListResponse<Invitee>>('/admin/api/invitees');
      return response;
    },
  });
}
