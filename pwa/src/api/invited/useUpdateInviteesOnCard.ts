import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Invitee, ListResponse, SymfonyValidationFailedResponse } from '#/components/types';

export default function useUpdateInviteesOnCard(
  queryOptions?: Omit<
    UseMutationOptions<ListResponse<Omit<Invitee, 'cardId'>>, AxiosError<SymfonyValidationFailedResponse>, { invitees: Record<Invitee['id'] | string, Omit<Invitee, 'id' | 'tableId' | 'cardId'>> }>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: { invitees: Record<Invitee['id'] | string, Omit<Invitee, 'id' | 'tableId' | 'cardId'>> }) => {
      const { data: response } = await axios.put<ListResponse<Omit<Invitee, 'cardId'>>>('/invited/api/invitees', data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['myInvitees'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
