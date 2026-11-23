export interface User {
	id: number;
	email: string;
	name: string;
	hashPassword: string;
}

export type PublicUser = Omit<User, "hashPassword">;
