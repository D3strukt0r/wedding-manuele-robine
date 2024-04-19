import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee, ListResponse } from '../components/types';

export default function useInvitees(
  queryOptions?: Omit<
    Parameters<typeof useQuery<ListResponse<Invitee>>>[0],
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['invitees'],
    queryFn: async () => {
      const { data } = await axios.get<ListResponse<Invitee>>('/admin/api/invitees');
      return data;
    },
  });
}
