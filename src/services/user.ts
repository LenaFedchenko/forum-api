
import type { refreshSessionRepository } from "../domain/refreshSession/repository";
import type { UserRepository } from "../domain/user/repository";
import { hashPasswordFunc, verifyPassword } from "../lib/password";
import type { UserService, TokenService, HashToken } from "./types/user.types";

export function createRegister(
    userRepository: UserRepository,
    tokenService: TokenService,
    tokenHasher: HashToken,
    refreshRepository: refreshSessionRepository
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
            const refreshToken = tokenService.signRefreshToken(user.id)
            const hashedToken = tokenHasher.hashToken(refreshToken)
            await refreshRepository.create({
                tokenHash: hashedToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })

            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                accessToken: tokenService.signAccessToken(user.id),
                refreshToken: refreshToken
            }
        },
        async refresh(refreshToken: string) {
            const userId = tokenService.verifyRefreshToken(refreshToken)
            const user = await userRepository.getUserById(userId)

            if (!user) {
                throw new Error("USER_NOT_FOUND")
            }
            const newRefreshToken = tokenService.signRefreshToken(user.id)
            const newTokenHash = tokenHasher.hashToken(newRefreshToken)
            const oldTokenHash = tokenHasher.hashToken(refreshToken)

            const rotationSuccess = await refreshRepository.rotation(
                oldTokenHash,
                newTokenHash,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            )

            if (!rotationSuccess) {
                throw new Error("INVALID_TOKEN")
            }
            return {
                accessToken: tokenService.signAccessToken(user.id),
                refreshToken: newRefreshToken
            }
        },
        async logout(token: string) {
            if (!token) {
                throw new Error("TOKEN_NOT_PROVIDED")
            }
            const tokenHash = tokenHasher.hashToken(token)
            await refreshRepository.deleteByHash(tokenHash)
        },
        async me(userId: number) {
            const user = await userRepository.getUserById(userId)
            if (!user) {
                throw new Error("USER_NOT_FOUND")
            }
            return {
                id: user.id,
                email: user.email,
                name: user.name
            }
        }

    };
}
