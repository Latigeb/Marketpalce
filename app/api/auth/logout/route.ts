import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { generateSessionToken, getSessionMaxAgeSeconds, hashSessionToken, SESSION_COOKIE_NAME } from '@/lib/session';
import { LoginSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = LoginSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid login payload.' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true
      }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + getSessionMaxAgeSeconds() * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: hashSessionToken(sessionToken),
        expiresAt
      }
    });

    cookies().set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionMaxAgeSeconds()
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json({ error: 'Unable to log in.' }, { status: 500 });
  }
}
