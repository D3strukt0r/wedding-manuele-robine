import { api } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
    const { queryClient } = await parent()

    await queryClient.prefetchQuery({
        queryKey: ['cards'],
        queryFn: () => api.admin.cards.list(),
    })
}
