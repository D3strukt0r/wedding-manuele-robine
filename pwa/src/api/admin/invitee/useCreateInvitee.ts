import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Invitee } from '#/components/types';

export default function useCreateInvitee(
  queryOptions?: Omit<
    UseMutationOptions<Invitee, DefaultError, Omit<Invitee, 'id'>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: Omit<Invitee, 'id'>) => {
      const { data: response } = await axios.post<Invitee>('/admin/api/invitees', data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['invitees'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
