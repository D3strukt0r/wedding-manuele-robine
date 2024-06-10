import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export interface Dashboard {
  foodChoices: Record<string, number>
  allergies: {
    inviteeId: number;
    name: string;
    allergies: string;
  }[],
}

export default function useDashboard(
  queryOptions?: Omit<
    UseQueryOptions<Dashboard>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    ...(queryOptions ?? {}),
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data: response } = await axios.get<Dashboard>('/admin/api/dashboard');
      return response;
    },
  });
}
