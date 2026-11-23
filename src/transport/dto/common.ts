export interface ErrorResponse {
	message: string;
}

export interface MessageResponse {
	message: string;
}

export type IdParams = { id: string };

export type NoParams = Record<string, never>;
