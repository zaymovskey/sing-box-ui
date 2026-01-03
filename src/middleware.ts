import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "sbui_session";

const encoder = new TextEncoder();

function getSecret() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return encoder.encode(secret);
}

async function isValidToken(token: string) {
  try {
    await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api")) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  const loggedIn = token ? await isValidToken(token) : false;

  if (loggedIn && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!loggedIn && pathname !== "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";

    // Делается для того, чтобы после логина вернуться на запрошенную изначально страницу
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
