import { AuthUser } from '@/types';

export const AUTH_USER_KEY = 'device-guard.auth.user';
export const AUTH_SESSION_KEY = 'device-guard.auth.session';

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
