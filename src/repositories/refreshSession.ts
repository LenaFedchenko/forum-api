import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d.js";
import type { refreshSessionRepository } from "../domain/refreshSession/repository";

export function createRefreshSessionRepository(db: PostgresClient<Contract>): refreshSessionRepository {
    return {
        async create(data){
            await db.orm.public.RefreshSession.create({
                ...data,
                expiresAt: Temporal.Instant.fromEpochMilliseconds(
                    data.expiresAt.getTime()
                )
            });
        },
        async getByHash(hash){
            const session = await db.orm.public.RefreshSession.where({ tokenHash: hash }).first();
            if (!session) return null
            return {
                id: session.id,
                tokenHash: session.tokenHash,
                userId: session.userId,
                expiresAt: new Date(session.expiresAt.epochMilliseconds)
            }
        },
        async rotation(oldHash, newTokenHash, expiresAt){
            // просроченную сессию не ротируем
            const update = await db.orm.public.RefreshSession
                .where({ tokenHash: oldHash })
                .where((s) => s.expiresAt.gt(Temporal.Now.instant()))
                .update({
                    tokenHash: newTokenHash,
                    expiresAt: Temporal.Instant.fromEpochMilliseconds(
                        expiresAt.getTime()
                    )
                });
            return update !== null
        },
        async deleteByHash(hash){
            await db.orm.public.RefreshSession.where({ tokenHash: hash }).delete();
        }
    }
}
