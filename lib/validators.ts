import { createHmac, randomBytes } from 'crypto';

export const SESSION_COOKIE_NAME = 'marketconnect_session';

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  const secret = process.env.AUTH_SECRET ?? 'development-secret';
  return createHmac('sha256', secret).update(token).digest('hex');
}

export function getSessionMaxAgeSeconds(): number {
  return 60 * 60 * 24 * 7;
}

