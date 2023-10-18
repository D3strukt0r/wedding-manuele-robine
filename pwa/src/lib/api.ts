import type { Invitee } from './types'
import { browser } from '$app/environment';

export const getApiUrl = async () => {
  let url: string;
  if (browser) {
    const { env } = await import('$env/dynamic/public');
    url = env.PUBLIC_API_URL;
  } else {
    const { env } = await import('$env/dynamic/private');
    url = env.API_URL;
  }
  return url;
};

export const api = (customFetch = fetch) => ({
  getInvitees: async (limit: number) => {
    const response = await customFetch(
      `${await getApiUrl()}/api/invitees`,
    )
    const data = (await response.json()) as Invitee[]
    return data.filter((x) => x.id <= limit)
  },
  getInviteeById: async (id: number): Promise<Invitee> => {
    const response = await customFetch(
      `${await getApiUrl()}/api/invitees/${id}`,
    )
    const data = (await response.json()) as Invitee
    return data
  },
})
