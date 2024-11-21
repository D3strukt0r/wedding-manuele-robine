import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SymfonyValidationFailedResponse } from '#/components/types';
import { getFilename, getMimeType } from '#/utils/download.ts';

interface DownloadGalleryImages {
  fileIds: 'all'|number[];
}

export default function useDownloadGalleryImages(
  queryOptions?: Omit<
    UseMutationOptions<[Blob, string, string], AxiosError<SymfonyValidationFailedResponse>, DownloadGalleryImages>,
    'mutationFn'
  >,
  axiosOptions?: Omit<Parameters<typeof axios.get<Blob>>[1], 'responseType'>,
) {
  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: DownloadGalleryImages) => {
      const params = new URLSearchParams({
        fileIds: Array.isArray(data.fileIds) ? data.fileIds.join(',') : data.fileIds,
      });

      const response = await axios.get<Blob>(`/invited/api/gallery/download?${params.toString()}`, {
        ...axiosOptions,
        responseType: 'blob',
      });
      return [response.data, getMimeType(response), getFilename(response)] satisfies [Blob, string, string];
    },
  });
}
