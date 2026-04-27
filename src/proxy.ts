import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = ['/app'];
const authPaths = ['/login', '/signup'];

export function proxy(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
