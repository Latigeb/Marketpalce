import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import {
  generateSessionToken,
  getSessionMaxAgeSeconds,
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/session';
import { RegisterSchema } from '@/lib/validators';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid registration payload.' }, { status: 400 });
    }

    const { email, password, name, role } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash: await hashPassword(password),
        role: role ?? 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + getSessionMaxAgeSeconds() * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: hashSessionToken(sessionToken),
        expiresAt,
      },
    });

    cookies().set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionMaxAgeSeconds(),
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration failed', error);
    return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 });
  }
}
