import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

interface GalleryResponse {
  files: {
    id: number;
    publicUrl: string;
  }[];
}

export default function useGalleryIds(
  queryOptions?: Omit<
    UseQueryOptions<GalleryResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['galleryIds'],
    queryFn: async () => {
      const { data: response } = await axios.get<GalleryResponse>('/invited/api/gallery');
      return response;
    },
  });
}
