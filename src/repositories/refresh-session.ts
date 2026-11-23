import type { RefreshSessionRepository } from "../domain/refresh-session/repository.js";
import type { Database } from "../prisma/db.js";

const toInstant = (date: Date) =>
	Temporal.Instant.fromEpochMilliseconds(date.getTime());

export function createRefreshSessionRepository(
	db: Database,
): RefreshSessionRepository {
	return {
		async create(data) {
			await db.orm.public.RefreshSession.create({
				...data,
				expiresAt: toInstant(data.expiresAt),
			});
		},

		async getByHash(hash) {
			const session = await db.orm.public.RefreshSession.where({
				tokenHash: hash,
			}).first();
			if (!session) return null;
			return {
				id: session.id,
				tokenHash: session.tokenHash,
				userId: session.userId,
				expiresAt: new Date(session.expiresAt.epochMilliseconds),
			};
		},

		async rotate({ oldHash, newHash, expiresAt }) {
			// просроченную сессию не ротируем
			const updated = await db.orm.public.RefreshSession.where({
				tokenHash: oldHash,
			})
				.where((s) => s.expiresAt.gt(Temporal.Now.instant()))
				.update({ tokenHash: newHash, expiresAt: toInstant(expiresAt) });
			return updated !== null;
		},

		async deleteByHash(hash) {
			await db.orm.public.RefreshSession.where({
				tokenHash: hash,
			}).delete();
		},
	};
}
