import type { RequestHandler } from "express";
import type { AuthService } from "../../services/auth/auth.types.js";
import {
	clearAuthCookies,
	readRefreshToken,
	setAuthCookies,
} from "../cookies/auth-cookies.js";
import type { LoginRequest, RegisterRequest } from "../dto/auth/requests.js";
import type { UserResponse } from "../dto/auth/responses.js";
import type {
	ErrorResponse,
	MessageResponse,
	NoParams,
} from "../dto/common.js";

export interface AuthHandlers {
	register: RequestHandler<
		NoParams,
		UserResponse | ErrorResponse,
		RegisterRequest
	>;
	login: RequestHandler<NoParams, UserResponse | ErrorResponse, LoginRequest>;
	refresh: RequestHandler<NoParams, MessageResponse | ErrorResponse>;
	logout: RequestHandler<NoParams, MessageResponse | ErrorResponse>;
	me: RequestHandler<NoParams, UserResponse | ErrorResponse>;
}

export function createAuthHandlers(authService: AuthService): AuthHandlers {
	return {
		async register(req, res) {
			const { name, email, password } = req.body ?? {};

			if (
				typeof name !== "string" ||
				typeof email !== "string" ||
				typeof password !== "string" ||
				!name.trim() ||
				!email.trim() ||
				!password.trim()
			) {
				res.status(422).json({ message: "Invalid user data" });
				return;
			}

			try {
				const user = await authService.register({ name, email, password });
				res.status(201).json(user);
			} catch (error) {
				if (
					error instanceof Error &&
					error.message === "EMAIL_ALREADY_EXISTS"
				) {
					res.status(409).json({ message: "Email already exists" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async login(req, res) {
			const { email, password } = req.body ?? {};

			if (
				typeof email !== "string" ||
				typeof password !== "string" ||
				!email.trim() ||
				!password.trim()
			) {
				res.status(422).json({ message: "Invalid user data" });
				return;
			}

			try {
				const result = await authService.login({ email, password });
				setAuthCookies(res, result);
				res.status(200).json(result.user);
			} catch (error) {
				if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
					res.status(401).json({ message: "Invalid credentials" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async refresh(req, res) {
			const refreshToken = readRefreshToken(req);

			if (!refreshToken) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				// новые токены уходят только в cookie
				const tokens = await authService.refresh(refreshToken);
				setAuthCookies(res, tokens);
				res.status(200).json({ message: "Tokens updated" });
			} catch (error) {
				if (
					error instanceof Error &&
					(error.message === "INVALID_REFRESH_TOKEN" ||
						error.message === "USER_NOT_FOUND")
				) {
					clearAuthCookies(res);
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async logout(req, res) {
			try {
				// без cookie удалять нечего, но cookie всё равно чистим: logout идемпотентный
				await authService.logout(readRefreshToken(req));
				clearAuthCookies(res);
				res.status(200).json({ message: "Successfully logged out" });
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async me(_req, res) {
			const userId = res.locals.userId;
			if (userId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const user = await authService.me(userId);
				res.status(200).json(user);
			} catch (error) {
				// токен ещё живой, а пользователя уже нет
				if (error instanceof Error && error.message === "USER_NOT_FOUND") {
					res.status(401).json({ message: "Unauthorized" });
					return;
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
