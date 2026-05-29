import { AuthUser } from '@/types';

export const AUTH_USER_KEY = 'device-guard.auth.user';
export const AUTH_SESSION_KEY = 'device-guard.auth.session';
export const AUTH_TOKEN_KEY = 'device-guard.auth.token';

export interface AuthSession {
  user: Omit<AuthUser, 'password'> & {
    id?: string;
    createdAt?: string;
  };
  token: string;
}

export function saveRegisteredUser(user: AuthUser) {
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getRegisteredUser() {
  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function startSession(user: AuthUser) {
  window.localStorage.setItem(
    AUTH_SESSION_KEY,
    JSON.stringify({
      fullName: user.fullName,
      email: user.email,
      loggedInAt: new Date().toISOString(),
    })
  );
}

export function saveSession(session: AuthSession) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, session.token);
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session.user));
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSessionUser() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession['user'];
  } catch {
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}
