import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '../components/types';

export default function useInviteeUpdate(
  id: Invitee['id'],
  queryOptions?: Omit<
    UseMutationOptions<Omit<Invitee, 'id'>, DefaultError, Invitee>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Invitee, 'id'>) => {
      const { data: response } = await axios.put<Invitee>(`/admin/api/invitees/${id}`, data);
      return response;
    },
  });
}
