import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const config = {
    matcher: [
        "/dashboard/:path*",
    ]
}

export default auth((req) => {
    if (!req.auth && !req.nextUrl.pathname.startsWith("/login")) {
        const url = req.nextUrl.clone()
        url.pathname = "/login"
        url.searchParams.set("callbackUrl", req.nextUrl.pathname)
        return NextResponse.redirect(url)
    }
})