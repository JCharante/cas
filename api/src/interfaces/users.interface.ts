export interface User {
  id: number;
  email: string;
  password: string;
}

export type Email = string;

export type SessionKey = string;

export interface RedesignedUser {
  email: Email;
  isAdmin: boolean;
}

export interface UserWithSessionKey extends RedesignedUser {
  sessionKey: SessionKey;
}
