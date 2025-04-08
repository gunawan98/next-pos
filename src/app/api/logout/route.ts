import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	console.log("hallooooo ", req)
	if (req.method === "POST") {
		// Clear cookies by setting them with an expired date
		const response = NextResponse.json({ message: "Logged out successfully" });
		response.cookies.set("accessToken", "", { httpOnly: true, path: "/", expires: new Date(0) });
		response.cookies.set("accessValidUntil", "", { httpOnly: true, path: "/", expires: new Date(0) });
		response.cookies.set("refreshToken", "", { httpOnly: true, path: "/", expires: new Date(0) });
		response.cookies.set("refreshValidUntil", "", { httpOnly: true, path: "/", expires: new Date(0) });
		return response;
	} else {
		// Return 405 Method Not Allowed for unsupported methods
		return NextResponse.json(
			{ error: "Method not allowed" },
			{ status: 405, headers: { Allow: "POST" } }
		);
	}
}