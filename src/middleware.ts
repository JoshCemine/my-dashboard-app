import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const config = {
    matcher: [
        "/dashboard/:path*",
    ]
}

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // If user is not logged in and trying to access protected routes
    if (!isLoggedIn && pathname.startsWith("/dashboard")) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // If user is logged in and trying to access login page
    if (isLoggedIn && pathname.startsWith("/login")) {
        const dashboardUrl = new URL("/dashboard", req.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
})