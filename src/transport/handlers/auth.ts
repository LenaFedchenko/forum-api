import type { CookieOptions, Request, Response } from "express";
import type { UserResponse } from "../dto/user/responses.js";
import type { LoginUser, UserService } from "../../services/types/user.types.js";
import type { UserRequest } from "../dto/user/requestes.js";
import { hasErrorCode, isUniqueViolation } from "../errors.js";

export interface UserError {
    message: string;
}

export interface UserHandler {
    register(
        req: Request<{}, UserResponse | UserError, UserRequest>,
        res: Response<UserResponse | UserError>
    ): Promise<Response<UserResponse | UserError>>;

    login(
        req: Request<{}, UserResponse | UserError, LoginUser>,
        res: Response<UserResponse | UserError>
    ): Promise<Response<UserResponse | UserError>>;

    refresh(
        req: Request<{}, { accessToken: string } | UserError, {}>,
        res: Response<{ accessToken: string } | UserError>
    ): Promise<Response<{ accessToken: string } | UserError>>;
    logout(
        req: Request<{}, UserError, {}>,
        res: Response<UserError>
    ): Promise<Response<UserError>>;
    me(
        req: Request<{}, UserResponse | UserError, {}>,
        res: Response<UserResponse | UserError>
    ): Promise<Response<UserResponse | UserError>>;
}

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const baseCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
};

// refresh-cookie уходит только на /users/*, то есть на refresh и logout
const accessCookieOptions: CookieOptions = { ...baseCookieOptions, path: "/" };
const refreshCookieOptions: CookieOptions = { ...baseCookieOptions, path: "/users" };

function setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    res.cookie("accessToken", tokens.accessToken, {
        ...accessCookieOptions,
        maxAge: ACCESS_TOKEN_MAX_AGE
    });

    res.cookie("refreshToken", tokens.refreshToken, {
        ...refreshCookieOptions,
        maxAge: REFRESH_TOKEN_MAX_AGE
    });
}

function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", accessCookieOptions);
    res.clearCookie("refreshToken", refreshCookieOptions);
}

export function createUserHandler(userService: UserService): UserHandler {
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
                return res.status(422).json({
                    message: "all fields are required"
                });
            }

            try {
                const user = await userService.register({
                    name,
                    email,
                    password
                });

                return res.status(201).json(user);
            } catch (error) {
                if (hasErrorCode(error, "EMAIL_ALREADY_EXISTS") || isUniqueViolation(error)) {
                    return res.status(409).json({
                        message: "email already exists"
                    });
                }

                console.error(error);

                return res.status(500).json({
                    message: "internal server error"
                });
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
                return res.status(422).json({
                    message: "all fields are required"
                });
            }

            try {
                const result = await userService.login({
                    email,
                    password
                });

                setAuthCookies(res, result);

                return res.status(200).json(result.user);
            } catch (error) {
                if (hasErrorCode(error, "INVALID_CREDENTIALS")) {
                    return res.status(401).json({
                        message: "invalid credentials"
                    });
                }

                console.error("LOGIN ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        },

        async refresh(req, res) {
            const refreshToken = req.cookies?.refreshToken;

            if (
                typeof refreshToken !== "string" ||
                !refreshToken.trim()
            ) {
                return res.status(401).json({
                    message: "refresh token is required"
                });
            }

            try {
                const result = await userService.refresh(refreshToken);

                setAuthCookies(res, result);

                return res.status(200).json({
                    accessToken: result.accessToken
                });
            } catch (error) {
                if (hasErrorCode(error, "INVALID_TOKEN")) {
                    clearAuthCookies(res);

                    return res.status(401).json({
                        message: "invalid refresh token"
                    });
                }

                if (hasErrorCode(error, "USER_NOT_FOUND")) {
                    clearAuthCookies(res);

                    return res.status(404).json({
                        message: "user not found"
                    });
                }

                console.error("REFRESH ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        },

        async logout(req, res) {
            const refreshToken = req.cookies?.refreshToken;

            try {
                // без cookie удалять нечего, но cookie всё равно чистим: logout идемпотентный
                if (typeof refreshToken === "string" && refreshToken.trim()) {
                    await userService.logout(refreshToken);
                }

                clearAuthCookies(res);

                return res.status(204).end();
            } catch (error) {
                console.error("LOGOUT ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        },

        async me(req, res) {
            const userId = res.locals.userId;

            if (typeof userId !== "number") {
                return res.status(401).json({
                    message: "unauthorized"
                });
            }

            try {
                const user = await userService.me(userId);

                if (!user) {
                    return res.status(404).json({
                        message: "user not found"
                    });
                }

                return res.status(200).json(user);
            } catch (error) {
                if (hasErrorCode(error, "USER_NOT_FOUND")) {
                    return res.status(404).json({
                        message: "user not found"
                    });
                }

                console.error("ME ERROR:", error);

                return res.status(500).json({
                    message: "internal server error"
                });
            }
        }
    };
}
