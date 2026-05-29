import { NextRequest } from 'next/server';
import { readDb } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();
  if (!query) return fail('Query is required');

  const normalized = query.toLowerCase();
  const db = await readDb();
  const device = db.devices.find(
    (item) => item.serialNumber.toLowerCase() === normalized || item.imei?.toLowerCase() === normalized
  );

  if (!device) {
    return ok({
      found: false,
      device: null,
    });
  }

  return ok({
    found: true,
    device: {
      id: device.id,
      name: device.name,
      brand: device.brand,
      model: device.model,
      category: device.category,
      serialNumber: device.serialNumber,
      imei: device.imei,
      status: device.status,
      dateLost: device.dateLost,
      dateFound: device.dateFound,
      lastLocation: device.status === 'lost' ? device.lastLocation : undefined,
      reward: device.status === 'lost' ? device.reward : undefined,
    },
  });
}
