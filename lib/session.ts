import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${ITERATIONS}:${salt}:${hash}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [iterationsText, salt, storedHash] = passwordHash.split(':');

  if (!iterationsText || !salt || !storedHash) {
    return false;
  }

  const iterations = Number(iterationsText);
  const derivedHash = pbkdf2Sync(password, salt, iterations, 64, DIGEST);
  const expectedHash = Buffer.from(storedHash, 'hex');

  return timingSafeEqual(derivedHash, expectedHash);
}

