import { CommentRepository } from "../domain/comment/repository.js";
import { Database } from "../prisma/db.js";

export function createCommentRepository(db: Database): CommentRepository {
	return {
		async getByPostId(postId) {
			return db.orm.public.Comment.where({ postId })
				.include("user")
				.orderBy((com) => com.createdAt.asc())
				.all();
		},
		async create(data) {
			try {
				return await db.orm.public.Comment.create(data);
			} catch (error) {
				// добавить валидацию ошибки
				console.log(error);
				throw error;
			}
		},
		async delete(commentId) {
			// добавить автор айди и потом удалить
			// добавить валидацию ошибки
			await db.orm.public.Comment.where({ id: commentId }).delete();
		},
		async getById(commentId) {
			return db.orm.public.Comment.where({ id: commentId }).first();
		}
	};
}
