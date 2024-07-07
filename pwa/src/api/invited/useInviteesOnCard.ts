import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee, ListResponse } from '#/components/types';

export default function useInviteesOnCard(
  queryOptions?: Omit<
    UseQueryOptions<ListResponse<Omit<Invitee, 'cardId'>>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['myInvitees'],
    queryFn: async () => {
      const { data: response } = await axios.get<ListResponse<Omit<Invitee, 'cardId'>>>('/invited/api/invitees');
      return response;
    },
  });
}
