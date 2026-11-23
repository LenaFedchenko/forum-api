import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { TokenService } from "../services/auth/auth.types.js";

type TokenKind = "access" | "refresh";

export interface TokenServiceOptions {
	accessSecret: string;
	refreshSecret: string;
	accessTtlMs: number;
	refreshTtlMs: number;
}

interface SignParams {
	userId: number;
	type: TokenKind;
	secret: string;
	ttlMs: number;
}

interface VerifyParams {
	token: string;
	type: TokenKind;
	secret: string;
	errorCode: string;
}

export function createTokenService(options: TokenServiceOptions): TokenService {
	function sign({ userId, type, secret, ttlMs }: SignParams): string {
		return jwt.sign({ type }, secret, {
			algorithm: "HS256",
			subject: String(userId),
			// jsonwebtoken ждёт секунды, а в config время в миллисекундах
			expiresIn: Math.floor(ttlMs / 1000),
			// уникальный jti, чтобы два токена, выданных в одну секунду, не совпадали по хэшу
			jwtid: randomUUID(),
		});
	}

	function verify({ token, type, secret, errorCode }: VerifyParams): number {
		try {
			const data = jwt.verify(token, secret, { algorithms: ["HS256"] });
			if (
				typeof data === "string" ||
				data.type !== type ||
				typeof data.sub !== "string"
			)
				throw new Error();
			const userId = Number(data.sub);
			if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error();
			return userId;
		} catch {
			throw new Error(errorCode);
		}
	}

	return {
		signAccess: (userId) =>
			sign({
				userId,
				type: "access",
				secret: options.accessSecret,
				ttlMs: options.accessTtlMs,
			}),
		signRefresh: (userId) =>
			sign({
				userId,
				type: "refresh",
				secret: options.refreshSecret,
				ttlMs: options.refreshTtlMs,
			}),
		verifyAccess: (token) =>
			verify({
				token,
				type: "access",
				secret: options.accessSecret,
				errorCode: "INVALID_ACCESS_TOKEN",
			}),
		verifyRefresh: (token) =>
			verify({
				token,
				type: "refresh",
				secret: options.refreshSecret,
				errorCode: "INVALID_REFRESH_TOKEN",
			}),
		hash: (token) => createHash("sha256").update(token).digest("hex"),
	};
}
