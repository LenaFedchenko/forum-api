export interface RefreshSession {
	id: number;
	tokenHash: string;
	userId: number;
	expiresAt: Date;
}
