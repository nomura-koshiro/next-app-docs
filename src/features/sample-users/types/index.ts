export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  role: string;
};

export type UpdateUserInput = {
  name: string;
  email: string;
  role: string;
};
