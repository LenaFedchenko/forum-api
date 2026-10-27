import type { Request, Response } from "express";
import type { UserResponse } from "../dto/user/responses.js";
import type { LoginUser, UserService } from "../../services/types/user.types.js";
import type { UserRequest } from "../dto/user/requestes.js";

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
            }catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "EMAIL_ALREADY_EXISTS"
                ) {
                    return res.status(409).json({
                        message: "email already exists"
                    })
                }

                if (
                    error !== null &&
                    typeof error === "object" &&
                    "sqlState" in error &&
                    error.sqlState === "23505"
                ) {
                    return res.status(409).json({
                        message: "email already exists"
                    })
                }

                console.error(error)

                return res.status(500).json({
                    message: "internal server error"
                })
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
                const result = await userService.login({ email, password });

                res.cookie("accessToken", result.accessToken, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                    path: "/"
                });

                return res.status(200).json(result.user);
            } catch (error) {
                console.error("LOGIN ERROR:", error)

                if (
                    error instanceof Error &&
                    error.message === "INVALID_CREDENTIALS"
                ) {
                    return res.status(401).json({
                        message: "invalid credentials"
                    })
                }

                return res.status(500).json({
                    message: "internal server error"
                })
            }
        }

    };
}