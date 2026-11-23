import { ROUTES } from "./routes.js";

export const AUTH_COOKIE = {
	ACCESS: "accessToken",
	REFRESH: "refreshToken",
} as const;

// refresh-cookie уходит только на /auth/*, то есть на refresh и logout
export const REFRESH_COOKIE_PATH = ROUTES.AUTH;
