import { api } from '$lib/api'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, params }) => {
  const { queryClient } = await parent()

  const inviteeId = parseInt(params.inviteeId)

  await queryClient.prefetchQuery({
    queryKey: ['invitee', inviteeId],
    queryFn: () => api.getInviteeById(inviteeId),
  })

  return { inviteeId }
}
