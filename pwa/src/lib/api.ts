import type {Card, Invitee, Table} from './types'
import axios from 'axios';

export const api = {
  common: {
    login: async (loginValues: { username: string, password: string }) => {
      const { data } = await axios.post<{token: string}>('/common/api/login_check', loginValues);
      return data;
    },
    lookup: {
      type: async (type: string) => {
        const { data } = await axios.get<string[]>(`/common/api/lookup/type/${type}`);
        return data;
      },
    },
  },
  admin: {
    invitees: {
      list: async (limit: number) => {
        const { data } = await axios.get<Invitee[]>('/admin/api/invitees');
        // return data.filter((x) => x.id <= limit);
        return data;
      },
      create: async (invitee: Omit<Invitee, 'id'>): Promise<void> => {
        const { data } = await axios.post(`/admin/api/invitees`, invitee);
        return data;
      },
      show: async (id: number): Promise<Invitee> => {
        const { data } = await axios.get<Invitee>(`/admin/api/invitees/${id}`);
        return data;
      },
      update: async (id: number, invitee: Omit<Invitee, 'id'>): Promise<void> => {
        await axios.put(`/admin/api/invitees/${id}`, invitee);
      },
      delete: async (id: number): Promise<void> => {
        await axios.delete(`/admin/api/invitees/${id}`);
      },
    },
    cards: {
      list: async (limit: number) => {
        const { data } = await axios.get<Card[]>('/admin/api/cards');
        // return data.filter((x) => x.id <= limit);
        return data;
      },
      create: async (card: Omit<Card, 'id'>): Promise<void> => {
        const { data } = await axios.post(`/admin/api/cards`, card);
        return data;
      },
      show: async (id: number): Promise<Card> => {
        const { data } = await axios.get<Card>(`/admin/api/cards/${id}`);
        return data;
      },
      update: async (id: number, card: Omit<Card, 'id'>): Promise<void> => {
        await axios.put(`/admin/api/cards/${id}`, card);
      },
      delete: async (id: number): Promise<void> => {
        await axios.delete(`/admin/api/cards/${id}`);
      },
    },
    tables: {
      list: async (limit: number) => {
        const { data } = await axios.get<Table[]>('/admin/api/tables');
        // return data.filter((x) => x.id <= limit);
        return data;
      },
      create: async (table: Omit<Table, 'id'>): Promise<void> => {
        const { data } = await axios.post(`/admin/api/tables`, table);
        return data;
      },
      show: async (id: number): Promise<Table> => {
        const { data } = await axios.get<Table>(`/admin/api/tables/${id}`);
        return data;
      },
      update: async (id: number, table: Omit<Table, 'id'>): Promise<void> => {
        await axios.put(`/admin/api/tables/${id}`, table);
      },
      delete: async (id: number): Promise<void> => {
        await axios.delete(`/admin/api/tables/${id}`);
      },
    },
  },
};
