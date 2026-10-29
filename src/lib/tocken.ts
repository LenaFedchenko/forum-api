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
export function signRefreshToken(userId: number): string {
    return jwt.sign({type: "refresh"}, process.env.JWT_SECRET!, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: 7 * 24 * 60 * 60
    })
}

export function verifyRefreshToken(token: string): number {
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET! , {algorithms: ["HS256"]})
        if (typeof payload === "string" || payload.type != "refresh" ||typeof payload.sub != "string") {
            throw new Error("INVALID_TOKEN")
        }
        const userId = Number(payload.sub)
        if (!Number.isSafeInteger(userId) || userId <= 0) throw new Error("INVALID_TOKEN")
            return userId
    } catch (err) {
        throw new Error("INVALID_TOKEN")
    }
}