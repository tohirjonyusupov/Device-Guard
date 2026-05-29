import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/server/auth';
import { readDb, writeDb } from '@/lib/server/db';
import { fail, notFound, ok, unauthorized } from '@/lib/server/http';
import { isDeviceStatus, isPlainObject, numberValue, optionalString } from '@/lib/server/validation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) return fail('Invalid request body');
  if (!isDeviceStatus(body.status)) return fail('Valid status is required');

  const { id } = await context.params;
  const db = await readDb();
  const index = db.devices.findIndex((item) => item.id === id && item.ownerId === user.id);
  if (index === -1) return notFound('Device not found');

  const now = new Date().toISOString();
  const date = now.slice(0, 10);
  const current = db.devices[index];
  const next = {
    ...current,
    status: body.status,
    lastLocation: body.lastLocation === undefined ? current.lastLocation : optionalString(body.lastLocation),
    reward: body.reward === undefined ? current.reward : numberValue(body.reward),
    dateLost: body.status === 'lost' ? current.dateLost ?? date : current.dateLost,
    dateFound: body.status === 'found' ? current.dateFound ?? date : current.dateFound,
    updatedAt: now,
  };

  db.devices[index] = next;
  await writeDb(db);

  return ok({ device: next });
}
