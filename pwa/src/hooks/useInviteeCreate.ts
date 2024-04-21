import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '../components/types';

export default function useInviteeCreate(
  queryOptions?: Omit<
    UseMutationOptions<Omit<Invitee, 'id'>, DefaultError, Invitee>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Invitee, 'id'>) => {
      const { data: response } = await axios.post<Invitee>('/admin/api/invitees', data);
      return response;
    },
  });
}
