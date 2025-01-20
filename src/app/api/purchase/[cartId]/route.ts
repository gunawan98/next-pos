import { validateAndRefreshToken } from "@/lib/validate_token";
import { NextResponse, NextRequest } from "next/server";

interface Params {
  cartId?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { validAccessToken, response } = await validateAndRefreshToken(request);

  if (!validAccessToken) {
    return (
      response ||
      NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    );
  }

  if (!params.cartId) {
    return NextResponse.json(
      { message: "Cart ID is required" },
      { status: 400 }
    );
  }

  try {
    const purchaseResponse = await fetch(
      `${process.env.HOST_NAME}/api/purchase/${params.cartId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${validAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!purchaseResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch purchase" },
        { status: purchaseResponse.status }
      );
    }

    const purchase = await purchaseResponse.json();

    // If the response already has cookies set, return that response
    if (response) {
      const newResponse = NextResponse.json(purchase, { status: 200 });

      const setCookieHeader = response.headers.get("Set-Cookie");
      if (setCookieHeader) {
        newResponse.headers.set("Set-Cookie", setCookieHeader);
      }

      return newResponse;
    }

    // Otherwise, just return the purchase data
    return NextResponse.json(purchase, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
