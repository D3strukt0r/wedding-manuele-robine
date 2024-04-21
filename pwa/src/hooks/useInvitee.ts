import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '../components/types';

export default function useInvitee(
  id: Invitee['id'],
  queryOptions?: Omit<
    UseQueryOptions<Invitee>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['invitee', id],
    queryFn: async () => {
      const { data: response } = await axios.get<Invitee>(`/admin/api/invitees/${id}`);
      return response;
    },
  });
}
