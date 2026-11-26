import { RequestHandler } from "express";
import type { Database } from "../prisma/db.js";
import { createCommentRepository } from "../repositories/comment.js";
import { createPostRepository } from "../repositories/post.js";
import { createCommentService } from "../services/comment/comment.js";
import { createCommentHandlers } from "../transport/handlers/comment.js";
import { createCommentRouter } from "../transport/routers/comment.js";

export function createCommentModule(db: Database, requireAuth: RequestHandler) {
	const repositoryPost = createPostRepository(db);
	const repository = createCommentRepository(db);
	// пост репозитори передавать в зависимость как бд
	const service = createCommentService(repository, repositoryPost);
	const handlers = createCommentHandlers(service);
	return {
		router: createCommentRouter(handlers, requireAuth),
		handlers,
	};
}