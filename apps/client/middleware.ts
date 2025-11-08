import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // List of protected routes
    const protectedRoutes = ["/cart", "/profile"]; // Add your protected pages here

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        // Check if user is authenticated
        // Since middleware runs on server, we need to check cookies or headers
        // For Firebase, you might need to use custom token or session cookies
        // This is a basic example; in production, use Firebase Admin SDK or custom auth

        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/signin", request.url));
        }

        // Optionally verify token with Firebase Admin
        // For simplicity, assuming token is valid if present
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/cart/:path*", "/profile/:path*"], // Match protected routes
};
