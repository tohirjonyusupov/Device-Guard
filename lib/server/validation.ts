import { DeviceCategory, DeviceStatus } from '@/types';

const categories: DeviceCategory[] = ['phone', 'laptop', 'tablet', 'watch', 'headphones', 'camera', 'other'];
const statuses: DeviceStatus[] = ['active', 'lost', 'found'];

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function optionalString(value: unknown) {
  const text = stringValue(value);
  return text || undefined;
}

export function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function isDeviceCategory(value: unknown): value is DeviceCategory {
  return typeof value === 'string' && categories.includes(value as DeviceCategory);
}

export function isDeviceStatus(value: unknown): value is DeviceStatus {
  return typeof value === 'string' && statuses.includes(value as DeviceStatus);
}
