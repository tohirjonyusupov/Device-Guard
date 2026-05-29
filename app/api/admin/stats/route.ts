import { NextRequest } from 'next/server';
import { getAuthUser, toPublicUser } from '@/lib/server/auth';
import { readDb } from '@/lib/server/db';
import { fail, ok, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();
  if ((user.role ?? 'user') !== 'admin') return fail('Forbidden', 403);

  const db = await readDb();
  const totalDevices = db.devices.length;
  const activeDevices = db.devices.filter((device) => device.status === 'active').length;
  const lostDevices = db.devices.filter((device) => device.status === 'lost').length;
  const foundDevices = db.devices.filter((device) => device.status === 'found').length;
  const registeredUsers = db.users.length;
  const adminUsers = db.users.filter((item) => (item.role ?? 'user') === 'admin').length;

  const recentUsers = [...db.users]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8)
    .map((item) => ({
      ...toPublicUser(item),
      deviceCount: db.devices.filter((device) => device.ownerId === item.id).length,
    }));

  return ok({
    stats: {
      registeredUsers,
      adminUsers,
      regularUsers: registeredUsers - adminUsers,
      totalDevices,
      activeDevices,
      lostDevices,
      foundDevices,
    },
    recentUsers,
  });
}
