import type { RefreshSession } from "./entity.js";

export type NewRefreshSession = Omit<RefreshSession, "id">;

export interface RotateRefreshSession {
	oldHash: string;
	newHash: string;
	expiresAt: Date;
}

export interface RefreshSessionRepository {
	create(data: NewRefreshSession): Promise<void>;
	getByHash(hash: string): Promise<RefreshSession | null>;
	rotate(data: RotateRefreshSession): Promise<boolean>;
	deleteByHash(hash: string): Promise<void>;
}
