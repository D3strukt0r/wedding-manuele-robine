import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Invitee, SymfonyValidationFailedResponse } from '#/components/types';

export default function useDeleteInvitee(
  id: Invitee['id'],
  queryOptions?: Omit<
    UseMutationOptions<unknown, AxiosError<SymfonyValidationFailedResponse>>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async () => {
      await axios.delete(`/admin/api/invitees/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['invitees'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
