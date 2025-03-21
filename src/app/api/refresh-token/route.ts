import { NextResponse, NextRequest } from "next/server";

interface RefreshTokenResponse {
  code: number;
  data: {
    access: string,
    access_valid_until: string,
    refresh: string,
    refresh_valid_until: string,
  };
}

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  const response = await fetch(`${process.env.HOST_NAME}/api/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  const result: RefreshTokenResponse = await response.json();

  if (result.code === 200) {
    // Return new tokens
    return NextResponse.json({
      accessToken: result.data.access,
      accessValidUntil: result.data.access_valid_until,
      refreshToken: result.data.refresh,
      refreshValidUntil: result.data.refresh_valid_until,
    });
  } else {
    return new NextResponse("Failed to refresh token", { status: 401 });
  }
}
