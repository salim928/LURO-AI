// frontend/middleware.ts
// Create this file in the ROOT of frontend folder (NOT in app folder)

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the pathname of the request
  const path = req.nextUrl.pathname;

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/dashboard/home', '/dashboard/query', '/dashboard/analytics', '/dashboard/reports', '/dashboard/settings', '/dashboard/team', '/dashboard/data-sources'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Auth routes that should redirect if already logged in
  const authRoutes = ['/sign-in', '/sign-up'];
  const isAuthRoute = authRoutes.includes(path);

  // If accessing protected route without session, redirect to sign-in
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/sign-in';
    redirectUrl.searchParams.set('redirectedFrom', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing auth routes with session, redirect to dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};