import { UserRole } from './role.enum';

export interface User {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  approved: boolean;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}