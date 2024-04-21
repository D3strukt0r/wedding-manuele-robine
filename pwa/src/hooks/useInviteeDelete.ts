import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '../components/types';

export default function useInviteeDelete(
  id: Invitee['id'],
  queryOptions?: Omit<
    UseMutationOptions,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/invitees/${id}`);
    },
  });
}
