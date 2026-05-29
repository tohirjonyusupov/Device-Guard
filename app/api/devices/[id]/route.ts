import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/server/auth';
import { readDb, writeDb } from '@/lib/server/db';
import { fail, notFound, ok, unauthorized } from '@/lib/server/http';
import {
  isDeviceCategory,
  isPlainObject,
  numberValue,
  optionalString,
  stringValue,
} from '@/lib/server/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const { id } = await context.params;
  const db = await readDb();
  const device = db.devices.find((item) => item.id === id && item.ownerId === user.id);
  if (!device) return notFound('Device not found');

  return ok({ device });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) return fail('Invalid request body');

  const { id } = await context.params;
  const db = await readDb();
  const index = db.devices.findIndex((item) => item.id === id && item.ownerId === user.id);
  if (index === -1) return notFound('Device not found');

  const current = db.devices[index];
  const next = {
    ...current,
    name: body.name === undefined ? current.name : stringValue(body.name),
    brand: body.brand === undefined ? current.brand : stringValue(body.brand),
    model: body.model === undefined ? current.model : stringValue(body.model),
    category: body.category === undefined || !isDeviceCategory(body.category) ? current.category : body.category,
    serialNumber:
      body.serialNumber === undefined ? current.serialNumber : stringValue(body.serialNumber).toUpperCase(),
    imei: body.imei === undefined ? current.imei : optionalString(body.imei),
    color: body.color === undefined ? current.color : optionalString(body.color),
    purchaseDate: body.purchaseDate === undefined ? current.purchaseDate : optionalString(body.purchaseDate),
    description: body.description === undefined ? current.description : optionalString(body.description),
    lastLocation: body.lastLocation === undefined ? current.lastLocation : optionalString(body.lastLocation),
    reward: body.reward === undefined ? current.reward : numberValue(body.reward),
    updatedAt: new Date().toISOString(),
  };

  if (!next.name) return fail('Device name is required');
  if (!next.brand) return fail('Device brand is required');
  if (!next.serialNumber) return fail('Serial number is required');

  const duplicate = db.devices.some(
    (device) =>
      device.id !== id &&
      (device.serialNumber.toUpperCase() === next.serialNumber.toUpperCase() ||
        (next.imei && device.imei && device.imei === next.imei))
  );
  if (duplicate) return fail('Device with this serial number or IMEI already exists', 409);

  db.devices[index] = next;
  await writeDb(db);

  return ok({ device: next });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const { id } = await context.params;
  const db = await readDb();
  const index = db.devices.findIndex((item) => item.id === id && item.ownerId === user.id);
  if (index === -1) return notFound('Device not found');

  const [device] = db.devices.splice(index, 1);
  await writeDb(db);

  return ok({ device });
}
