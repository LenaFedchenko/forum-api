import type { PublicUser, User } from "../../domain/user/entity.js";
import type { AuthService, AuthServiceDeps } from "./auth.types.js";

function toPublicUser(user: User): PublicUser {
	return { id: user.id, email: user.email, name: user.name };
}

export function createAuthService({
	users,
	sessions,
	passwords,
	tokens,
	refreshTtlMs,
}: AuthServiceDeps): AuthService {
	const refreshExpiresAt = () => new Date(Date.now() + refreshTtlMs);

	return {
		async register(input) {
			const email = input.email.trim().toLowerCase();
			const hashPassword = await passwords.hash(input.password);
			// занятый email ловит репозиторий (EMAIL_ALREADY_EXISTS)
			const user = await users.create({
				email,
				name: input.name,
				hashPassword,
			});
			return toPublicUser(user);
		},

		async login(input) {
			const email = input.email.trim().toLowerCase();
			const user = await users.getByEmail(email);

			if (
				!user ||
				!(await passwords.verify(user.hashPassword, input.password))
			) {
				throw new Error("INVALID_CREDENTIALS");
			}

			const refreshToken = tokens.signRefresh(user.id);
			await sessions.create({
				userId: user.id,
				tokenHash: tokens.hash(refreshToken),
				expiresAt: refreshExpiresAt(),
			});

			return {
				user: toPublicUser(user),
				accessToken: tokens.signAccess(user.id),
				refreshToken,
			};
		},

		async refresh(refreshToken) {
			const userId = tokens.verifyRefresh(refreshToken);
			const oldHash = tokens.hash(refreshToken);

			const session = await sessions.getByHash(oldHash);
			if (
				!session ||
				session.userId !== userId ||
				session.expiresAt.getTime() <= Date.now()
			) {
				throw new Error("INVALID_REFRESH_TOKEN");
			}

			const user = await users.getById(userId);
			if (!user) throw new Error("USER_NOT_FOUND");

			const newRefreshToken = tokens.signRefresh(user.id);
			const rotated = await sessions.rotate({
				oldHash,
				newHash: tokens.hash(newRefreshToken),
				expiresAt: refreshExpiresAt(),
			});
			if (!rotated) throw new Error("INVALID_REFRESH_TOKEN");

			return {
				accessToken: tokens.signAccess(user.id),
				refreshToken: newRefreshToken,
			};
		},

		async logout(refreshToken) {
			if (!refreshToken) return;
			await sessions.deleteByHash(tokens.hash(refreshToken));
		},

		async me(userId) {
			const user = await users.getById(userId);
			if (!user) throw new Error("USER_NOT_FOUND");
			return toPublicUser(user);
		},
	};
}
