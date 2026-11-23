import type { PostRepository } from "../domain/post/repository.js";
import type { Database } from "../prisma/db.js";
import { isForeignKeyViolation, isUniqueViolation } from "./db-errors.js";

export function createPostRepository(db: Database): PostRepository {
	// у автора берём только публичные поля, чтобы hashPassword не ушёл клиенту
	function withRelations() {
		return db.orm.public.Post.include("category").include("user", (user) =>
			user.select("id", "name", "email"),
		);
	}

	return {
		async getAll({ take, category } = {}) {
			let query = withRelations();

			if (category) {
				const foundCategory = await db.orm.public.Category.where({
					name: category,
				}).first();
				if (!foundCategory) return [];
				query = query.where({ categoryId: foundCategory.id });
			}

			return take === undefined ? query.all() : query.limit(take).all();
		},

		async getById(id) {
			return withRelations().where({ id }).first();
		},

		async create(data) {
			try {
				return await withRelations().create(data);
			} catch (error) {
				if (isUniqueViolation(error)) {
					throw new Error("POST_ALREADY_EXISTS");
				}
				if (isForeignKeyViolation(error, "Post_categoryId_fkey")) {
					throw new Error("CATEGORY_NOT_FOUND");
				}
				if (isForeignKeyViolation(error, "Post_userId_fkey")) {
					throw new Error("USER_NOT_FOUND");
				}
				throw error;
			}
		},

		async getPostsByAuthorId(userId) {
			return withRelations().where({ userId }).all();
		},
	};
}
