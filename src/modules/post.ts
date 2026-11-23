import type { RequestHandler } from "express";
import type { Database } from "../prisma/db.js";
import { createPostRepository } from "../repositories/post.js";
import { createPostService } from "../services/post/post.js";
import { createPostHandlers } from "../transport/handlers/post.js";
import { createPostRouter } from "../transport/routers/post.js";

export function createPostModule(db: Database, requireAuth: RequestHandler) {
	const repository = createPostRepository(db);
	const service = createPostService(repository);
	return createPostRouter(createPostHandlers(service), requireAuth);
}
