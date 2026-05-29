import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/server/auth';
import { readDb, writeDb } from '@/lib/server/db';
import { created, fail, ok, unauthorized } from '@/lib/server/http';
import {
  isDeviceCategory,
  isDeviceStatus,
  isPlainObject,
  numberValue,
  optionalString,
  stringValue,
} from '@/lib/server/validation';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().toLowerCase();
  const status = searchParams.get('status');
  const category = searchParams.get('category');

  const db = await readDb();
  const devices = db.devices.filter((device) => {
    if (device.ownerId !== user.id) return false;
    if (status && status !== 'all' && device.status !== status) return false;
    if (category && category !== 'all' && device.category !== category) return false;
    if (!q) return true;

    return [device.name, device.brand, device.model, device.serialNumber, device.imei]
      .filter(Boolean)
      .some((value) => value?.toLowerCase().includes(q));
  });

  return ok({ devices });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) return fail('Invalid request body');

  const name = stringValue(body.name);
  const brand = stringValue(body.brand);
  const model = stringValue(body.model);
  const serialNumber = stringValue(body.serialNumber).toUpperCase();

  if (!name) return fail('Device name is required');
  if (!brand) return fail('Device brand is required');
  if (!serialNumber) return fail('Serial number is required');
  if (!isDeviceCategory(body.category)) return fail('Valid device category is required');

  const db = await readDb();
  const duplicate = db.devices.some(
    (device) =>
      device.serialNumber.toUpperCase() === serialNumber ||
      (body.imei && device.imei && device.imei === stringValue(body.imei))
  );
  if (duplicate) return fail('Device with this serial number or IMEI already exists', 409);

  const now = new Date().toISOString();
  const device = {
    id: crypto.randomUUID(),
    ownerId: user.id,
    name,
    brand,
    model,
    category: body.category,
    serialNumber,
    imei: optionalString(body.imei),
    status: isDeviceStatus(body.status) ? body.status : 'active',
    dateAdded: now.slice(0, 10),
    color: optionalString(body.color),
    purchaseDate: optionalString(body.purchaseDate),
    description: optionalString(body.description),
    lastLocation: optionalString(body.lastLocation),
    reward: numberValue(body.reward),
    updatedAt: now,
  };

  db.devices.push(device);
  await writeDb(db);

  return created({ device });
}
