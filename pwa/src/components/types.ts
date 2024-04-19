export type Invitee = {
  id: number;
  firstname: string;
  lastname: string;
  email: string | null;
  willCome: boolean | null;
  food: string | null;
  allergies: string | null;
  tableId: number | null;
  cardId: number | null;
};

export type Card = {
  id: number;
  userLoginId: string | null;
  inviteeIds: number[];
};

export type Table = {
  id: number;
  seats: number;
  inviteeIds: number[];
};

export type User = {
  id: number;
  username: string;
  roles: string[];
};

export type ListResponse<T> = {
  total: number;
  offset: number;
  limit: number;
  records: T[];
};
