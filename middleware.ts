import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/dashboard', '/bills/:path*'],
};

export function middleware(req: NextRequest) {
  // Placeholder: Implement session/cookie check for SSR route protection if needed
  return NextResponse.next();
}
