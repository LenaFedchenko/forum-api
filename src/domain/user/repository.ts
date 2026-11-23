import type { User } from "./entity.js";

export type NewUser = Omit<User, "id">;

export interface UserRepository {
	create(data: NewUser): Promise<User>;
	getByEmail(email: string): Promise<User | null>;
	getById(id: number): Promise<User | null>;
}
