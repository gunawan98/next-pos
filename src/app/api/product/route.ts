import { validateAndRefreshToken } from "@/lib/validate_token";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { validAccessToken, response } = await validateAndRefreshToken(request);

  if (!validAccessToken) {
    return (
      response ||
      NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    );
  }

  try {
    const productResponse = await fetch(
      `${process.env.HOST_NAME}/api/product`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!productResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch products" },
        { status: productResponse.status }
      );
    }

    const products = await productResponse.json();

    // If the response already has cookies set, return that response
    if (response) {
      const newResponse = NextResponse.json(products, { status: 200 });

      const setCookieHeader = response.headers.get("Set-Cookie");
      if (setCookieHeader) {
        newResponse.headers.set("Set-Cookie", setCookieHeader);
      }

      return newResponse;
    }

    // Otherwise, just return the product data
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
