import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { GalleryImages, SymfonyValidationFailedResponse } from '#/components/types';

interface UpdateMyGallery {
  fileIds: number[];
}

export default function useUpdateMyGallery(
  queryOptions?: Omit<
    UseMutationOptions<GalleryImages, AxiosError<SymfonyValidationFailedResponse>, UpdateMyGallery>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    ...(queryOptions ?? {}),
    mutationFn: async (data: UpdateMyGallery) => {
      const { data: response } = await axios.put<GalleryImages>(`/invited/api/gallery`, data);
      return response;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      queryClient.invalidateQueries({ queryKey: ['myGallery'] });
      queryOptions?.onSuccess?.(data, variables, context);
    },
  });
}
