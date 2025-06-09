import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const { pathname } = url;

	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;
	const refreshValidUntil = request.cookies.get("refreshValidUntil")?.value;

	const now = new Date();

	const isRefreshTokenExpired =
		refreshValidUntil && new Date(refreshValidUntil) <= now;

	// Redirect to dashboard if user is authenticated and tries to access the login page
	if (refreshToken && !isRefreshTokenExpired && pathname === "/login") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	// Define protected paths
	const protectedPaths = ["/dashboard", "/profile", "/api/product", "/product"];
	const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

	// Redirect to login if no refresh token or refresh token is expired
	if (!refreshToken || isRefreshTokenExpired) {
		if (isProtected) {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Attempt to refresh the access token if it's expired but the refresh token is still valid
	if (!accessToken && refreshToken && !isRefreshTokenExpired) {
		try {
			const refreshURL = new URL("/api/refresh-token", request.url);

			const refreshResponse = await fetch(refreshURL.href, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refreshToken }),
			});

			if (refreshResponse.ok) {
				const newTokens = await refreshResponse.json();
				const response = NextResponse.next();

				// Set new tokens in cookies
				response.cookies.set("accessToken", newTokens.accessToken, {
					path: "/",
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					expires: new Date(newTokens.accessValidUntil),
				});
				response.cookies.set("accessValidUntil", newTokens.accessValidUntil, {
					path: "/",
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					expires: new Date(newTokens.accessValidUntil),
				});
				response.cookies.set("refreshToken", newTokens.refreshToken, {
					path: "/",
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					expires: new Date(newTokens.refreshValidUntil),
				});
				response.cookies.set("refreshValidUntil", newTokens.refreshValidUntil, {
					path: "/",
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					expires: new Date(newTokens.refreshValidUntil),
				});

				return response;
			} else {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		} catch (error) {
			console.error("Error refreshing token:", error);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/purchase/:path*",
		"/profile/:path*",
		"/login",
		"/api/product",
		"/product"
	],
};
