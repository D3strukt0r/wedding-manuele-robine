import axios from 'axios';
import { Invitee, ListResponse } from './types';

export const api = {
  common: {
    login: async (loginValues: { username: string; password: string }) => {
      const { data } = await axios.post<{ token: string }>('/common/api/login_check', loginValues);
      return data;
    },
    lookup: {
      type: async (type: string) => {
        const { data } = await axios.get<string[]>(`/common/api/lookup/type/${type}`);
        return data;
      },
    },
  },
  invited: {
    invitees: {
      list: async () => {
        const { data } = await axios.get<ListResponse<Omit<Invitee, 'cardId'>>>('/invited/api/invitees');
        return data;
      },
      update: async (invitees: Record<Invitee['id'] | string, Omit<Invitee, 'id' | 'tableId' | 'cardId'>>) => {
        const { data } = await axios.put<ListResponse<Omit<Invitee, 'cardId'>>>('/invited/api/invitees', { invitees });
        return data;
      },
    },
  },
};
