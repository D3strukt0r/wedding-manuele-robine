import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SymfonyValidationFailedResponse } from '#/components/types';
import { getFilename, getMimeType } from '#/utils/download.ts';

interface DownloadGalleryImages {
  fileIds: 'all'|number[];
}

type DownloadGalleryImagesResponseAsync = {
  message: string;
  hash: string;
}

export default function useDownloadGalleryImages(
  queryOptions?: Omit<
    UseMutationOptions<[Blob, string, string] | DownloadGalleryImagesResponseAsync, AxiosError<SymfonyValidationFailedResponse>, DownloadGalleryImages>,
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

      // If we got a HTTP ACCEPED (202) status code, it means that the server is
      // still processing the request asynchonously, return the json response instead
      // of the blob.
      if (response.status === 202) {
        const text = await response.data.text();
        return JSON.parse(text) as DownloadGalleryImagesResponseAsync;
      }

      return [response.data, getMimeType(response), getFilename(response)] satisfies [Blob, string, string];
    },
  });
}
