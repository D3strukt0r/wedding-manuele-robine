import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

type GalleryDownloadState = 'pending' | 'create_zip' | 'downloading' | 'caching';

export interface DownloadCheckAsyncProcess {
  message: string;
  state: GalleryDownloadState;
  context: {
    countDone: number;
  } | Array<any>;
  fileCount: number;
}

type DownloadCheck = {
  message: string;
} | DownloadCheckAsyncProcess

export default function useDownloadState(
  hash: string,
  queryOptions?: Omit<
    UseQueryOptions<DownloadCheck>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['download', hash],
    queryFn: async () => {
      const params = new URLSearchParams({
        hash,
      });

      const { data: response } = await axios.get<DownloadCheck>(`/invited/api/gallery/check-download?${params.toString()}`);
      return response;
    },
  });
}
