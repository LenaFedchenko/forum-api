import type { RefreshSession } from "./entity";


export type NewRefreshSession = Pick<
    RefreshSession,
    "userId" | "tokenHash" | "expiresAt"
>;

export type StoredRefreshSession = Omit<RefreshSession, "user">;

export interface refreshSessionRepository{
    create(data: NewRefreshSession): Promise<void>;
    getByHash(hash: string): Promise<StoredRefreshSession | null>;
    rotation(oldHash: string, newTokenHash: string, expiresAt: Date): Promise<boolean>;
    deleteByHash(hash: string): Promise<void>;
}
