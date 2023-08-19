import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { getJWTsecretKey } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  console.log('Origin', origin);
  console.log('Pathname', pathname);

  const jwttokenincookies = request.cookies.get('user_token')?.value;
  console.log('Token', jwttokenincookies);

  try {
    if (pathname === '/login') {
      if (jwttokenincookies) return NextResponse.redirect(`${origin}`);
      return NextResponse.next();
    }

    if (!jwttokenincookies) {
      return NextResponse.redirect('http://localhost:3000/login');
    }

    const verifyToken = await jwtVerify(
        jwttokenincookies,
      new TextEncoder().encode(getJWTsecretKey())
    );
    console.log('VerifyToken', verifyToken);

    if (verifyToken) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { Error: { message: 'Authentication Required' } },
      { status: 401 }
    );
  } catch (error) {
    console.log(error);
  }
}

export const config = {
  matcher: ['/', '/login', '/protected'],
};
