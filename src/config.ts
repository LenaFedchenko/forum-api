import "dotenv/config";

function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is not defined`);
	return value;
}

function positiveInt(name: string, fallback: number): number {
	const raw = process.env[name];
	if (raw === undefined || raw === "") return fallback;
	const value = Number(raw);
	if (!Number.isSafeInteger(value) || value <= 0) {
		throw new Error(`${name} must be a positive integer`);
	}
	return value;
}

export const config = {
	port: positiveInt("PORT", 3000),
	isProduction: process.env.NODE_ENV === "production",
	corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
	databaseUrl: required("DATABASE_URL"),
	passwordPepper: Buffer.from(required("PASSWORD_PEPPER")),
	jwt: {
		accessSecret: required("JWT_ACCESS_SECRET"),
		refreshSecret: required("JWT_REFRESH_SECRET"),
		accessTtlMs: positiveInt("TOKEN_ACCESS_TIME", 15 * 60 * 1000),
		refreshTtlMs: positiveInt("TOKEN_REFRESH_TIME", 7 * 24 * 60 * 60 * 1000),
	},
} as const;

export type Config = typeof config;
