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
  userLoginId: number | null;
  inviteeIds: number[];
};

export type Table = {
  id: number;
  name: string;
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

export type SymfonyAuthenticationFailedResponse = {
  code: number;
  message: string;
}

export type SymfonyValidationFailedResponse = {
  class: string;
  detail: string;
  status: number;
  title: string;
  trace: {
    args: string[][];
    class: string;
    file: string;
    function: string;
    line: number;
    namespace: string;
    short_class: string;
    type: string;
  }[];
  type: string;
  violations: {
    parameters: Record<string, string>;
    propertyPath: string;
    template: string;
    title: string;
    type: string;
  }[];
}

export type GalleryImage = {
  id: number;
  publicUrl: string;
  mimeType: string;
  blurhash: string;
  height: number;
  width: number;
  children: GalleryImage[];
}

export type GalleryImages = {
  files: GalleryImage[];
}
