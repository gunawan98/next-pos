"use server";

import { validateAndRefreshToken } from "@/lib/validate_token";
import { ApiResponse } from "@/types/api-response";
import { cookies } from "next/headers";
import { z } from "zod";

export async function createDataProduct(name: string, barcode: string, stock: number, price: number, discount: number): Promise<ApiResponse> {
	const schema = z.object({
		name: z.string(),
		barcode: z.string(),
		stock: z.number(),
		price: z.number(),
		discount: z.number(),
	});

	const parse = schema.safeParse({ name, barcode, stock, price, discount });

	if (!parse.success) {
		return { message: "Invalid input", status: 400 };
	}

	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/product`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parse.data),
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.status };
			}
			return { message: data.message, status: data.status };
		}

		return { message: "Create product successfully.", status: 200, ...data };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function updateDataProduct(productId: string, name: string, barcode: string, stock: number, price: number, discount: number): Promise<ApiResponse> {
	const schema = z.object({
		name: z.string(),
		barcode: z.string(),
		stock: z.number(),
		price: z.number(),
		discount: z.number(),
	});

	const parse = schema.safeParse({ name, barcode, stock, price, discount });

	if (!parse.success) {
		return { message: "Invalid input", status: 400 };
	}

	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/product/${productId}`, {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parse.data),
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.status };
			}
			return { message: data.message, status: data.status };
		}

		return { message: "Product updated successfully.", status: 200, data: data };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function deleteProduct(productId: number): Promise<ApiResponse> {
	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/product/${productId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
				"Content-Type": "application/json",
			},
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.status };
			}
			return { message: data.message, status: data.status };
		}

		return { message: "Product has been deleted.", status: 200, };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function addImageToProduct(productId: string, formData: FormData): Promise<ApiResponse> {
	const cookieStore = cookies();
	const { validAccessToken, response } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/product/${productId}/image`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
			},
			body: formData,
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.code };
			}
			return { message: data.message, status: data.code };
		}

		return { message: "Product updated successfully.", status: 200, data: data };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function getProductImage(productId: number): Promise<ApiResponse> {
	const cookieStore = cookies();
	const { validAccessToken } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/product/${productId}/image`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
			},
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.code };
			}
			return { message: data.message, status: data.code };
		}

		return { message: data.message, status: 200, data: data };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}

export async function deleteProductImage(imageId: number): Promise<ApiResponse> {
	const cookieStore = cookies();
	const { validAccessToken } = await validateAndRefreshToken({
		cookies: cookieStore,
		headers: { cookie: cookieStore.getAll() },
	});

	if (!validAccessToken) {
		return { message: "Not authenticated", status: 401 };
	}

	try {
		const responseApi = await fetch(`${process.env.HOST_NAME}/api/image/${imageId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${validAccessToken}`,
			},
		});

		const data = await responseApi.json();

		if (!data.success) {
			if (typeof data.data === "string") {
				return { message: data.data, status: data.code };
			}
			return { message: data.message, status: data.code };
		}

		return { message: "Delete image successfully.", status: 200, data: data };
	} catch (error) {
		return { message: "Internal Server Error", status: 500 };
	}
}
