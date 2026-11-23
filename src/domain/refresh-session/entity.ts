import type { User } from "../user/entity";

export interface RefreshSession {
    id: number;
    tokenHash: string;
    user: User;
    userId: number;
    expiresAt: Date;
}