import type {Card, Invitee, Table, User} from './types'
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
      list: async () => {
        const { data } = await axios.get<Invitee[]>('/admin/api/invitees');
        return data;
      },
      create: async (invitee: Omit<Invitee, 'id'>) => {
        const { data } = await axios.post<Invitee>(`/admin/api/invitees`, invitee);
        return data;
      },
      show: async (id: number) => {
        const { data } = await axios.get<Invitee>(`/admin/api/invitees/${id}`);
        return data;
      },
      update: async (id: number, invitee: Omit<Invitee, 'id'>) => {
        const { data } = await axios.put<Invitee>(`/admin/api/invitees/${id}`, invitee);
        return data;
      },
      delete: async (id: number) => {
        await axios.delete(`/admin/api/invitees/${id}`);
      },
    },
    cards: {
      list: async () => {
        const { data } = await axios.get<Card[]>('/admin/api/cards');
        return data;
      },
      create: async (card: Omit<Card, 'id'>) => {
        const { data } = await axios.post<Card>(`/admin/api/cards`, card);
        return data;
      },
      show: async (id: number) => {
        const { data } = await axios.get<Card>(`/admin/api/cards/${id}`);
        return data;
      },
      update: async (id: number, card: Omit<Card, 'id'>) => {
        const { data } = await axios.put<Card>(`/admin/api/cards/${id}`, card);
        return data;
      },
      delete: async (id: number) => {
        await axios.delete(`/admin/api/cards/${id}`);
      },
    },
    tables: {
      list: async () => {
        const { data } = await axios.get<Table[]>('/admin/api/tables');
        return data;
      },
      create: async (table: Omit<Table, 'id'>) => {
        const { data } = await axios.post<Table>(`/admin/api/tables`, table);
        return data;
      },
      show: async (id: number) => {
        const { data } = await axios.get<Table>(`/admin/api/tables/${id}`);
        return data;
      },
      update: async (id: number, table: Omit<Table, 'id'>) => {
        const { data } = await axios.put<Table>(`/admin/api/tables/${id}`, table);
        return data;
      },
      delete: async (id: number) => {
        await axios.delete(`/admin/api/tables/${id}`);
      },
    },
    users: {
      list: async () => {
        const { data } = await axios.get<User[]>('/admin/api/users');
        return data;
      },
      create: async (table: Omit<User, 'id'>) => {
        const { data } = await axios.post<User>(`/admin/api/users`, table);
        return data;
      },
      show: async (id: number) => {
        const { data } = await axios.get<User>(`/admin/api/users/${id}`);
        return data;
      },
      update: async (id: number, table: Omit<User, 'id'>) => {
        const { data } = await axios.put<User>(`/admin/api/users/${id}`, table);
        return data;
      },
      delete: async (id: number) => {
        await axios.delete(`/admin/api/users/${id}`);
      },
    },
  },
};
