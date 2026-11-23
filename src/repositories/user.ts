import type { UserRepository } from "../domain/user/repository.js";
import type { Database } from "../prisma/db.js";
import { isUniqueViolation } from "./db-errors.js";

export function createUserRepository(db: Database): UserRepository {
	return {
		async create(data) {
			try {
				return await db.orm.public.User.create(data);
			} catch (error) {
				if (isUniqueViolation(error)) {
					throw new Error("EMAIL_ALREADY_EXISTS");
				}
				throw error;
			}
		},

		async getByEmail(email) {
			return db.orm.public.User.where({ email }).first();
		},

		async getById(id) {
			return db.orm.public.User.where({ id }).first();
		},
	};
}
