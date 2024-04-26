import axios from 'axios';

export const api = {
  common: {
    login: async (loginValues: { username: string; password: string }) => {
      const { data } = await axios.post<{ token: string }>('/common/api/login_check', loginValues);
      return data;
    },
  },
};
