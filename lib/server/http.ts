import { NextResponse } from 'next/server';

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return ok(data, { status: 201 });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message,
        details,
      },
    },
    { status }
  );
}

export function unauthorized() {
  return fail('Unauthorized', 401);
}

export function notFound(message = 'Not found') {
  return fail(message, 404);
}
