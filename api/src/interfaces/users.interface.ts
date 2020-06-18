export interface User {
  id: number;
  email: string;
  password: string;
}

export type Email = string;

export interface RedesignedUser {
  email: Email;
  isAdmin: boolean;
}
