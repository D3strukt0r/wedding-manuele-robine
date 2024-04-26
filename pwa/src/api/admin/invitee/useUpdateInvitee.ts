import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '#/components/types';

export default function useUpdateInvitee(
  id: Invitee['id'],
  queryOptions?: Omit<
    UseMutationOptions<Invitee, DefaultError, Omit<Invitee, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Invitee, 'id'>) => {
      const { data: response } = await axios.put<Invitee>(`/admin/api/invitees/${id}`, data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['invitees'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
