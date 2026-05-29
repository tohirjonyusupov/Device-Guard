import { Device } from '@/types';
import { UserRole } from '@/types';
import { getAuthToken } from './auth';

interface ApiEnvelope<T> {
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
  };
  token: string;
}

export interface DeviceResponse {
  device: Device;
}

export interface DevicesResponse {
  devices: Device[];
}

export interface PublicCheckResponse {
  found: boolean;
  device: Device | null;
}

export interface AdminStatsResponse {
  stats: {
    registeredUsers: number;
    adminUsers: number;
    regularUsers: number;
    totalDevices: number;
    activeDevices: number;
    lostDevices: number;
    foundDevices: number;
  };
  recentUsers: Array<{
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    role: UserRole;
    createdAt: string;
    deviceCount: number;
  }>;
}

async function request<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = getAuthToken();

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });
  const payload = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? 'Request failed');
  }
  if (!payload.data) {
    throw new Error('Invalid API response');
  }

  return payload.data;
}

export const api = {
  register(input: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    return request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  login(input: { email: string; password: string }) {
    return request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  listDevices(params: { q?: string; status?: string; category?: string } = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    const query = search.toString();
    return request<DevicesResponse>(`/api/devices${query ? `?${query}` : ''}`);
  },

  createDevice(input: Partial<Device>) {
    return request<DeviceResponse>('/api/devices', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  getDevice(id: string) {
    return request<DeviceResponse>(`/api/devices/${id}`);
  },

  updateDevice(id: string, input: Partial<Device>) {
    return request<DeviceResponse>(`/api/devices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  updateDeviceStatus(id: string, input: Pick<Device, 'status'> & Partial<Device>) {
    return request<DeviceResponse>(`/api/devices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  deleteDevice(id: string) {
    return request<DeviceResponse>(`/api/devices/${id}`, {
      method: 'DELETE',
    });
  },

  checkDevice(query: string) {
    return request<PublicCheckResponse>(`/api/public/check?query=${encodeURIComponent(query)}`);
  },

  getAdminStats() {
    return request<AdminStatsResponse>('/api/admin/stats');
  },
};
