import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function POST(request: NextRequest) {
    const { email, password, redirect } = await request.json()

    const response = NextResponse.json({ ok: true })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 401 })
    }

    return response
}



