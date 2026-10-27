import "dotenv/config"
import jwt from "jsonwebtoken"

export function signAccessToken(userId: number): string {
    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
        throw new Error("JWT_SECRET_NOT_FOUND")
    }

    return jwt.sign({}, secretKey, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: 15 * 60
    })
}
