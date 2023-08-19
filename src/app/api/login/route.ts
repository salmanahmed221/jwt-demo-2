import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getJWTsecretKey } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.username === 'admin' && body.password === 'admin') {
    const createjwt = await new SignJWT({
      username: body.username,
      role: 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1m')
      .sign(new TextEncoder().encode(getJWTsecretKey()));
    cookies().set('user_token', createjwt, { httpOnly: true });
    return NextResponse.json({ accessToken: createjwt }, { status: 200 });
  }
  return NextResponse.json(
    { Error: { message: 'Failed to create token' } },
    { status: 400 }
  );
}
