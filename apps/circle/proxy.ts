import { auth } from "@oss/auth";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
	"/login",
	"/signup",
	"/forgot-password",
	"/reset-password",
	"/verify-email",
];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublic =
		PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
		pathname.startsWith("/api/auth") ||
		pathname.endsWith("/opengraph-image");

	if (isPublic) {
		return NextResponse.next();
	}

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session) {
		const loginUrl = new URL("/login", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
