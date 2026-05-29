import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { createToken, hashPassword, toPublicUser } from '@/lib/server/auth';
import { readDb, writeDb } from '@/lib/server/db';
import { created, fail } from '@/lib/server/http';
import { isPlainObject, optionalString, stringValue } from '@/lib/server/validation';
import { UserRole } from '@/types';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!isPlainObject(body)) return fail('Invalid request body');

  const fullName = stringValue(body.fullName);
  const email = stringValue(body.email).toLowerCase();
  const phone = optionalString(body.phone);
  const password = stringValue(body.password);

  if (fullName.length < 3) return fail('Full name must be at least 3 characters');
  if (!email.includes('@')) return fail('Valid email is required');
  if (password.length < 6) return fail('Password must be at least 6 characters');

  const db = await readDb();
  const exists = db.users.some((user) => user.email.toLowerCase() === email);
  if (exists) return fail('User with this email already exists', 409);

  const hasAdmin = db.users.some((item) => (item.role ?? 'user') === 'admin');
  const role: UserRole = hasAdmin ? 'user' : 'admin';
  const user = {
    id: crypto.randomUUID(),
    fullName,
    email,
    phone,
    role,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  await writeDb(db);

  return created({
    user: toPublicUser(user),
    token: createToken(user.id),
  });
}
