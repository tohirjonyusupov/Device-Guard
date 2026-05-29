import { Device } from '@/types';
import { UserRole } from '@/types';

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  createdAt: string;
}

export interface StoredDevice extends Device {
  ownerId: string;
  updatedAt: string;
}

export interface DatabaseShape {
  users: StoredUser[];
  devices: StoredDevice[];
}

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}
