import { validateAndRefreshToken } from "@/lib/validate_token";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { validAccessToken, response } = await validateAndRefreshToken(request);

  if (!validAccessToken) {
    return (
      response ||
      NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    );
  }

  try {
    const cartResponse = await fetch(
      `${process.env.HOST_NAME}/api/cart/finished`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!cartResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch carts" },
        { status: cartResponse.status }
      );
    }

    const carts = await cartResponse.json();

    // If the response already has cookies set, return that response
    if (response) {
      const newResponse = NextResponse.json(carts, { status: 200 });

      // Ensure `Set-Cookie` header from the original response is passed forward, if present
      const setCookie = response.headers.get("Set-Cookie");
      if (setCookie) {
        newResponse.headers.set("Set-Cookie", setCookie);
      }

      return newResponse;
    }

    // Otherwise, return the product data directly
    return NextResponse.json(carts, { status: 200 });
  } catch (error) {
    console.error("Error fetching carts:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
