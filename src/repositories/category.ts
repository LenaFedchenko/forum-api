import type { CategoryRepository } from "../domain/category/repository.js";
import type { Database } from "../prisma/db.js";
import { isUniqueViolation } from "./db-errors.js";

export function createCategoryRepository(db: Database): CategoryRepository {
	return {
		async getAll() {
			return db.orm.public.Category.all();
		},

		async getById(id) {
			return db.orm.public.Category.where({ id }).first();
		},

		async create(data) {
			try {
				return await db.orm.public.Category.create(data);
			} catch (error) {
				if (isUniqueViolation(error)) {
					throw new Error("CATEGORY_ALREADY_EXISTS");
				}
				throw error;
			}
		},
	};
}
