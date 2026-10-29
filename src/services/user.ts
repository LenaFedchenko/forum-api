
import type { UserRepository } from "../domain/user/repository";
import { hashPasswordFunc, verifyPassword } from "../lib/password";
import type { UserService, TokenService } from "./types/user.types";

export function createRegister(
    userRepository: UserRepository,
    tokenService: TokenService
): UserService {
    return {
        async register(user) {
            const { name, password } = user;
            const email = user.email.trim().toLowerCase();
            const existingUser = await userRepository.getUserByEmail(email)

            if (existingUser) {
                throw new Error("EMAIL_ALREADY_EXISTS")
            }
            const hashPassword = await hashPasswordFunc(password);

            const newUser = await userRepository.createUser({
                email,
                name,
                hashPassword
            });

            return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            };
        },

        
        async login(input) {
            const email = input.email.trim().toLowerCase()

            const user = await userRepository.getUserByEmail(email)

            console.log("USER FOUND:", Boolean(user))

            if (!user) {
                throw new Error("INVALID_CREDENTIALS")
            }

            const isValidPassword = await verifyPassword(
                user.hashPassword,
                input.password
            )

            console.log("PASSWORD VALID:", isValidPassword)

            if (!isValidPassword) {
                throw new Error("INVALID_CREDENTIALS")
            }

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                accessToken: tokenService.signAccessToken(user.id),
                refreshToken: tokenService.signRefreshToken(user.id)
            }
        },
        async refresh(refreshToken: string) {
            const userId = tokenService.verifyRefreshToken(refreshToken)
            const user = await userRepository.getUserById(userId)

            if (!user) {
                throw new Error("USER_NOT_FOUND")
            }

            return {
                accessToken: tokenService.signAccessToken(user.id),
                refreshToken: tokenService.signRefreshToken(user.id)
            }
        }

    };
}
