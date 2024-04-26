import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SymfonyAuthenticationFailedResponse } from '#/components/types.ts';

export default function useLogin(
  queryOptions?: Omit<
    UseMutationOptions<{ token: string }, AxiosError<SymfonyAuthenticationFailedResponse>, { username: string; password: string }>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: { username: string; password: string }) => {
      const { data: response } = await axios.post<{ token: string }>('/common/api/login_check', data);
      return response;
    },
  });
}
