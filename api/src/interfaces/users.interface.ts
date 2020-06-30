import { ObjectId } from 'mongodb';

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface MongoUser {
  _id: ObjectId;
  email: string;
  hashedPassword: string;
  isAdmin: boolean;
}

export interface MongoSession {
  _id: ObjectId;
  sessionKey: string;
  email: string;
}

export type Email = string;

export type SessionKey = string;

export interface RedesignedUser {
  email: Email;
  isAdmin: boolean;
}

export interface RedesignedUserWithPassword extends RedesignedUser {
  hashedPassword: string;
}
