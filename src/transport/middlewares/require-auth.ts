import type { RequestHandler } from "express";
import type { TokenService } from "../../services/auth/auth.types.js";
import { readAccessToken } from "../cookies/auth-cookies.js";

export function createRequireAuth(tokens: TokenService): RequestHandler {
	return (req, res, next) => {
		const token = readAccessToken(req);
		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		try {
			res.locals.userId = tokens.verifyAccess(token);
			next();
		} catch {
			res.status(401).json({ message: "Unauthorized" });
		}
	};
}
