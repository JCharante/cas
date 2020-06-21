import { Request } from 'express';
import { User } from './users.interface';

export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface Lock {
  name: string;
  expiresOn: Date;
  agent: string;
}
