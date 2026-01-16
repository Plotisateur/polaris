import { Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  MARKET_ADMIN = 'MARKET_ADMIN',
}
export interface IUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role?: UserRole;
}

