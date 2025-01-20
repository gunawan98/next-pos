import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

/**
 * Validates the access token and refreshes it if expired, then sets new tokens in cookies if needed.
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<{ validAccessToken: string | null; response: NextResponse | null }>} - An object containing the valid access token and the response to return (if any).
 */
export async function validateAndRefreshToken(
	request: NextRequest
): Promise<{ validAccessToken: string | null; response: NextResponse | null }> {
	const accessToken = request.cookies.get("accessToken")?.value;
	const refreshToken = request.cookies.get("refreshToken")?.value;

	if (!refreshToken) {
		return {
			validAccessToken: null,
			response: NextResponse.json(
				{ message: "Not authenticated" },
				{ status: 401 }
			),
		};
	}

	let validAccessToken = accessToken || null;
	let newAccessToken: string | undefined;
	let newRefreshToken: string | undefined;
	let accessValidUntil: Date | undefined;
	let refreshValidUntil: Date | undefined;

	// Check if the access token is expired
	if (!accessToken && refreshToken) {
		try {
			// Attempt to refresh the access token using the refresh token
			const refreshResponse = await fetch(
				`${process.env.HOST_NAME}/api/refresh`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ refresh: refreshToken }),
				}
			);

			const refreshResult = await refreshResponse.json();

			if (refreshResult.code === 200) {
				// Successfully refreshed tokens
				newAccessToken = refreshResult.data.access || undefined;
				newRefreshToken = refreshResult.data.refresh || undefined;
				accessValidUntil = refreshResult.data.access_valid_until
					? new Date(refreshResult.data.access_valid_until)
					: undefined;
				refreshValidUntil = refreshResult.data.refresh_valid_until
					? new Date(refreshResult.data.refresh_valid_until)
					: undefined;

				validAccessToken = newAccessToken || null;

				// Create a response with the new cookies
				const response = NextResponse.json(
					{ message: "Token refreshed successfully" },
					{ status: 200 }
				);

				// Set cookies and ensure no `null` values are passed
				if (newAccessToken) {
					response.cookies.set("accessToken", newAccessToken, {
						path: "/",
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						expires: accessValidUntil, // safely pass undefined if null
					});
				}

				if (accessValidUntil) {
					response.cookies.set("accessValidUntil", accessValidUntil.toISOString(), {
						path: "/",
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						expires: accessValidUntil,
					});
				}

				if (newRefreshToken) {
					response.cookies.set("refreshToken", newRefreshToken, {
						path: "/",
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						expires: refreshValidUntil, // safely pass undefined if null
					});
				}

				if (refreshValidUntil) {
					response.cookies.set("refreshValidUntil", refreshValidUntil.toISOString(), {
						path: "/",
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						expires: refreshValidUntil,
					});
				}

				return {
					validAccessToken,
					response,
				};
			} else {
				return {
					validAccessToken: null,
					response: NextResponse.json(
						{ message: "Not authenticated" },
						{ status: 401 }
					),
				};
			}
		} catch (error) {
			console.error("Error refreshing token:", error);
			return {
				validAccessToken: null,
				response: NextResponse.json(
					{ message: "Internal Server Error" },
					{ status: 500 }
				),
			};
		}
	}

	// If no refresh was needed, return the valid access token
	return {
		validAccessToken,
		response: null,
	};
}
