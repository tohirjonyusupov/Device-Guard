import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { PublicUser, StoredUser } from './types';

const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_SECRET = process.env.DEVICE_GUARD_TOKEN_SECRET ?? 'device-guard-dev-secret';

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(':');
  if (!salt || !storedHash) return false;

  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

export function createToken(userId: string) {
  const payload = base64url(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE_SECONDS,
    })
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string) {
  const [payload, signature] = token.split('.');
  if (!payload || !signature || sign(payload) !== signature) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
    };
    if (!parsed.sub || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed.sub;
  } catch {
    return null;
  }
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role ?? 'user',
    createdAt: user.createdAt,
  };
}

export async function getAuthUser(request: NextRequest) {
  const header = request.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  if (!token) return null;

  const userId = verifyToken(token);
  if (!userId) return null;

  // const db = await readDb();
  // return db.users.find((user: StoredUser) => user.id === userId) ?? null;
}
