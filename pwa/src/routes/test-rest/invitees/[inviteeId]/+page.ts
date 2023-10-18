import { api } from '$lib/api'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, fetch, params }) => {
  const { queryClient } = await parent()

  const inviteeId = parseInt(params.inviteeId)

  await queryClient.prefetchQuery({
    queryKey: ['invitee', inviteeId],
    queryFn: () => api(fetch).getInviteeById(inviteeId),
  })

  return { inviteeId }
}
