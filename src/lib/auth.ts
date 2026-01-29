import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        },
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminPage = nextUrl.pathname.startsWith("/admin");

            if (isAdminPage) {
                if (isLoggedIn) {
                    // Check whitelist for admin access
                    const adminWhitelist = (process.env.ADMIN_WHITELIST || "").split(",");
                    const userEmail = auth.user?.email || "";
                    if (adminWhitelist.includes(userEmail)) return true;
                    return Response.redirect(new URL("/", nextUrl));
                }
                return false; // Redirect to login
            }
            return true;
        },
    },
    pages: {
        signIn: "/", // We'll use a modal or simple button on home
    },
});
