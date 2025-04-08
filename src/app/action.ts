"use server";

import { validateAndRefreshToken } from "@/lib/validate_token";
import { cookies } from "next/headers";
import { z } from "zod";

export interface ApiResponse {
	message: string;
	status: number;
}

export async function addItemToCart(formData: FormData, cartId: string) {
	const schema = z.object({
		barcode: z.string().min(1),
		quantity: z.coerce.number(),
	});

	const parse = schema.safeParse({
		barcode: formData.get("barcode"),
		quantity: formData.get("quantity"),
	});

	if (!parse.success) {
		return { message: "Invalid input", status: 400 };
	}

	// Get cookies for token validation
	const cookieStore = cookies();

	// Validate token
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return response
			? { message: response.statusText || "Error", status: response.status }
			: { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(
			`${process.env.HOST_NAME}/api/cart-item/${cartId}`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${validAccessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(parse.data),
			}
		);

		if (!responseApi.ok) {
			return {
				message: "Failed to add item to cart",
				status: responseApi.status,
			};
		}

		const cartData = await responseApi.json();

		// Optionally, invalidate cache on the related path
		// revalidatePath("/dashboard");

		return { message: "Item added to cart", status: 200, data: cartData };
	} catch (error) {
		console.error("Error adding item to cart:", error);
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function purchasingCart(formData: FormData, cartId: string) {
	const schema = z.object({
		cart_id: z.coerce.number(),
		paid: z.coerce.number(),
		payment_method: z.string().min(1),
	});

	const parse = schema.safeParse({
		cart_id: cartId,
		paid: formData.get("paid"),
		payment_method: formData.get("payment_method"),
	});

	if (!parse.success) {
		return { message: "Invalid input", status: 400 };
	}

	// Get cookies for token validation
	const cookieStore = cookies();

	// Validate token
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return response || { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/purchase`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parse.data),
		});

		const purchaseResponse = await responseApi.json();

		if (purchaseResponse.code !== 200) {
			return {
				message: `${purchaseResponse.message}`,
				status: purchaseResponse.code,
				data: "",
			};
		}

		// Optionally, invalidate cache on the related path
		// revalidatePath("/dashboard");

		return {
			message: "Purchase successfully",
			status: 200,
			data: purchaseResponse.data,
		};
	} catch (error) {
		console.error("Error purchasing cart:", error);
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function updateItemInCart(cartId: string, productId: number, quantity: number) {
	const schema = z.object({
		product_id: z.number(),
		quantity: z.number(),
	});

	const parse = schema.safeParse({ product_id: productId, quantity });

	if (!parse.success) {
		return { message: "Invalid input", status: 400 };
	}

	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return response || { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/cart-item/${cartId}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parse.data),
		});

		if (!responseApi.ok) {
			return { message: "Failed to update item in cart", status: responseApi.status };
		}

		const cartData = await responseApi.json();
		return { message: "Item updated in cart", status: 200, data: cartData };
	} catch (error) {
		console.error("Error updating item in cart:", error);
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function deleteItemFromCart(cartItemId: number): Promise<ApiResponse> {
	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/cart-item/${cartItemId}`, {
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
		console.error("Error deleting item from cart:", error);
		return { message: "Internal Server Error", status: 500 };
	}
}