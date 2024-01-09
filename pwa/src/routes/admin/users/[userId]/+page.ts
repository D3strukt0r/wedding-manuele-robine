import { api } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
  const { queryClient } = await parent();

  const userId = parseInt(params.userId);

  await queryClient.prefetchQuery({
    queryKey: ['user', userId],
    queryFn: () => api.admin.users.show(userId),
  });

  return { userId };
}
