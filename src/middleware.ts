import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public paths (no auth required)
    const isPublicPath = pathname.startsWith("/login") || pathname.startsWith("/auth")
    const isStaticAsset =
        pathname.startsWith("/_next") ||
        pathname.startsWith("/public") ||
        pathname === "/favicon.ico" ||
        /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/.test(pathname)

    if (isPublicPath || isStaticAsset) {
        return NextResponse.next()
    }

    const response = NextResponse.next({
        request: { headers: request.headers },
    })

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

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        const url = new URL("/login", request.url)
        url.searchParams.set("redirect", pathname)
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)|login|auth).*)",
}


