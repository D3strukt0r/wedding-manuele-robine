import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SymfonyValidationFailedResponse } from '#/components/types';
import { serialize as objectToFormData } from 'object-to-formdata';

interface UploadFile {
  file: File;
}
interface UploadFileResponse {
  id: number;
}

export default function useUploadFile(
  queryOptions?: Omit<
    UseMutationOptions<UploadFileResponse, AxiosError<SymfonyValidationFailedResponse>, UploadFile>,
    'mutationFn'
  >,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: UploadFile) => {
      const { data: response } = await axios.post<UploadFileResponse>(`/common/api/file`, objectToFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    },
  });
}
