import { api } from '$lib/api';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
  const { queryClient } = await parent();

  const cardId = parseInt(params.cardId);

  await queryClient.prefetchQuery({
    queryKey: ['card', cardId],
    queryFn: () => api.cards.show(cardId),
  });

  return { cardId };
}
