"use server";

import { cookies } from "next/headers";
import { validateAndRefreshToken } from "@/lib/validate_token";

export async function deleteAvailableCart(cartId: number) {
	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		try {
			const responseApi = await fetch(`${process.env.HOST_NAME}/api/cart/${cartId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${validAccessToken}`,
					"Content-Type": "application/json",
				},
			});

			if (!responseApi.ok) {
				const errorData = await responseApi.json();
				return { message: errorData.message || "Failed to delete item", status: responseApi.status };
			}
			return { message: "Item successfully deleted", status: 200 };
		} catch (error) {
			return { message: "Internal Server Error", status: 500 };
		}
	} catch (error) {
		return { error: "Fail deleting cart.", status: 500 };
	}
}