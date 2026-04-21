export type DeviceCategory =
  | 'phone'
  | 'laptop'
  | 'tablet'
  | 'watch'
  | 'headphones'
  | 'camera'
  | 'other';

export type DeviceStatus = 'active' | 'lost' | 'found';

export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

export interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: DeviceCategory;
  serialNumber: string;
  imei?: string;
  status: DeviceStatus;
  dateAdded: string;
  dateLost?: string;
  dateFound?: string;
  color?: string;
  description?: string;
  purchaseDate?: string;
  lastLocation?: string;
  reward?: number;
}

export interface AuthUser {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}
