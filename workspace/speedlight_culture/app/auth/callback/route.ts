import { NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (searchParams.has('error')) {
        const err = searchParams.get('error')
        const errDesc = searchParams.get('error_description')
        return NextResponse.redirect(`${origin}/login?error=${err}&details=${errDesc}`)
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}?welcome=true`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}?welcome=true`)
            } else {
                return NextResponse.redirect(`${origin}${next}?welcome=true`)
            }
        } else {
            console.error('Supabase Auth Error:', error)
            return NextResponse.redirect(`${origin}/login?error=AuthExchangeError`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
