import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { GalleryImages } from '#/components/types.ts';

export default function useMyGallery(
  queryOptions?: Omit<
    UseQueryOptions<GalleryImages>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['myGallery'],
    queryFn: async () => {
      const { data: response } = await axios.get<GalleryImages>('/invited/api/gallery/my');
      return response;
    },
  });
}
