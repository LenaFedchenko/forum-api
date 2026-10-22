import "dotenv/config"
import argon2 from "argon2"

export function hashPasswordFunc(password: string): Promise<string>{
    const pepper = process.env.PEPPER
    if (!pepper) {
        throw new Error("PEPPER_NOT_FOUND")
    }
    return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
        secret: Buffer.from(pepper)
    })
}

export function verifyPassword(
    hashPassword: string,
    password: string
): Promise<boolean>{
    return argon2.verify(hashPassword, password)
}