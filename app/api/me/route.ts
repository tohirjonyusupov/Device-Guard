import { NextRequest } from 'next/server';
import { getAuthUser, toPublicUser } from '@/lib/server/auth';
import { ok, unauthorized } from '@/lib/server/http';

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();

  return ok({ user: toPublicUser(user) });
}
