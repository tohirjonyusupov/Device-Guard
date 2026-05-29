import { NextRequest } from 'next/server';
import { createToken, toPublicUser, verifyPassword } from '@/lib/server/auth';
import { readDb } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';
import { isPlainObject, stringValue } from '@/lib/server/validation';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) return fail('Invalid request body');

  const email = stringValue(body.email).toLowerCase();
  const password = stringValue(body.password);

  const db = await readDb();
  const user = db.users.find((item) => item.email.toLowerCase() === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return fail('Email or password is incorrect', 401);
  }

  return ok({
    user: toPublicUser(user),
    token: createToken(user.id),
  });
}
