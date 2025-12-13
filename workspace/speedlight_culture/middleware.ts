import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const host = request.headers.get('host')

    // Redirect speedlightculture.com to www.speedlightculture.com in production
    if (process.env.NODE_ENV === 'production' && host === 'speedlightculture.com') {
        const url = request.nextUrl.clone()
        url.hostname = 'www.speedlightculture.com'
        return NextResponse.redirect(url)
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - /api/auth (BetterAuth routes)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
