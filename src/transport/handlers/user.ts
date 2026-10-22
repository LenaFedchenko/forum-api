import type { Request, Response } from "express";
import type { UserResponse } from "../dto/user/responses.js";
import type { UserService } from "../../services/types/user.types.js";
import type { UserRequest } from "../dto/user/requestes.js";

export interface UserError {
    message: string;
}

export interface UserHandler {
    register(
        req: Request<{}, UserResponse | UserError, UserRequest>,
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

            const user = await userService.register({
                name,
                email,
                password
            });

            return res.status(201).json(user);
        }
    };
}