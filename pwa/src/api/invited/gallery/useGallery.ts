import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { GalleryImages } from '#/components/types.ts';

export default function useGallery(
  queryOptions?: Omit<
    UseQueryOptions<GalleryImages>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data: response } = await axios.get<GalleryImages>('/invited/api/gallery');
      return response;
    },
  });
}
