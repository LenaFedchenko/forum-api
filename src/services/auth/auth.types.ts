import type { RefreshSessionRepository } from "../../domain/refresh-session/repository.js";
import type { PublicUser } from "../../domain/user/entity.js";
import type { UserRepository } from "../../domain/user/repository.js";

export interface RegisterInput {
	name: string;
	email: string;
	password: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface PasswordHasher {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}

export interface TokenService {
	signAccess(userId: number): string;
	signRefresh(userId: number): string;
	verifyAccess(token: string): number;
	verifyRefresh(token: string): number;
	hash(token: string): string;
}

export interface AuthServiceDeps {
	users: UserRepository;
	sessions: RefreshSessionRepository;
	passwords: PasswordHasher;
	tokens: TokenService;
	refreshTtlMs: number;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthService {
	register(input: RegisterInput): Promise<PublicUser>;
	login(input: LoginInput): Promise<{ user: PublicUser } & AuthTokens>;
	refresh(refreshToken: string): Promise<AuthTokens>;
	logout(refreshToken?: string): Promise<void>;
	me(userId: number): Promise<PublicUser>;
}
