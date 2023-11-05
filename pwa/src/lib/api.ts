import type {Card, Invitee, Table} from './types'
import axios from 'axios';

export const api = {
  invitees: {
    list: async (limit: number) => {
      const { data } = await axios.get<Invitee[]>('/api/invitees');
      return data.filter((x) => x.id <= limit);
    },
    show: async (id: number): Promise<Invitee> => {
      const { data } = await axios.get<Invitee>(`/api/invitees/${id}`);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await axios.delete(`/api/invitees/${id}`);
    },
  },
  cards: {
    list: async (limit: number) => {
      const { data } = await axios.get<Card[]>('/api/cards');
      return data.filter((x) => x.id <= limit);
    },
    show: async (id: number): Promise<Card> => {
      const { data } = await axios.get<Card>(`/api/cards/${id}`);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await axios.delete(`/api/cards/${id}`);
    },
  },
  tables: {
    list: async (limit: number) => {
      const { data } = await axios.get<Table[]>('/api/tables');
      return data.filter((x) => x.id <= limit);
    },
    show: async (id: number): Promise<Table> => {
      const { data } = await axios.get<Table>(`/api/tables/${id}`);
      return data;
    },
    delete: async (id: number): Promise<void> => {
      await axios.delete(`/api/tables/${id}`);
    },
  },
};
