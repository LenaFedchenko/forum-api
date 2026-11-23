import type { CookieOptions, Request, Response } from "express";
import { config } from "../../config.js";
import { AUTH_COOKIE, REFRESH_COOKIE_PATH } from "../../constants/auth.js";
import type { AuthTokens } from "../../services/auth/auth.types.js";

const base: CookieOptions = {
	httpOnly: true,
	secure: config.isProduction,
	sameSite: "lax",
};
const access: CookieOptions = { ...base, path: "/" };
const refresh: CookieOptions = { ...base, path: REFRESH_COOKIE_PATH };

export function setAuthCookies(res: Response, tokens: AuthTokens): void {
	res.cookie(AUTH_COOKIE.ACCESS, tokens.accessToken, {
		...access,
		maxAge: config.jwt.accessTtlMs,
	});
	res.cookie(AUTH_COOKIE.REFRESH, tokens.refreshToken, {
		...refresh,
		maxAge: config.jwt.refreshTtlMs,
	});
}

export function clearAuthCookies(res: Response): void {
	res.clearCookie(AUTH_COOKIE.ACCESS, access);
	res.clearCookie(AUTH_COOKIE.REFRESH, refresh);
}

function readCookie(req: Request, name: string): string | undefined {
	const token: unknown = req.cookies?.[name];
	return typeof token === "string" && token.trim() ? token : undefined;
}

export function readAccessToken(req: Request): string | undefined {
	return readCookie(req, AUTH_COOKIE.ACCESS);
}

export function readRefreshToken(req: Request): string | undefined {
	return readCookie(req, AUTH_COOKIE.REFRESH);
}
