import type { Invitee } from './types'
import axios from 'axios';

export const api = {
  getInvitees: async (limit: number) => {
    const { data } = await axios.get<Invitee[]>('/api/invitees');
    return data.filter((x) => x.id <= limit);
  },
  getInviteeById: async (id: number): Promise<Invitee> => {
    const { data } = await axios.get<Invitee>(`/api/invitees/${id}`);
    return data;
  },
};
