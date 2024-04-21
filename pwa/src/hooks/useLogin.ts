import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios from 'axios';

export default function useLogin(
  queryOptions?: Omit<
    UseMutationOptions<{ token: string }, DefaultError, { username: string; password: string }>,
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
