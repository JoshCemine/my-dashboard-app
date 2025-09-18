import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import jwt from "jsonwebtoken";
import Google from "next-auth/providers/google"


const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) {
    throw new Error("Missing SUPABASE_URL environment variable");
}

const supabaseSecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseSecret) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}


export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [Google],
    adapter: SupabaseAdapter({
        url: supabaseUrl,
        secret: supabaseSecret,
    }),
    callbacks: {
        async session({ session, user }) {
            const signingSecret = process.env.SUPABASE_JWT_SECRET
            if (signingSecret) {
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: user.id,
                    email: user.email,
                    role: "authenticated",
                }
                session.supabaseAccessToken = jwt.sign(payload, signingSecret)
            }
            return session
        },
        authorized: async ({ auth }) => {
            return !!auth
        },
    },

})