import { type RequestHandler, Router } from "express";
import type { PostHandlers } from "../handlers/post.js";

export function createPostRouter(
	handlers: PostHandlers,
	requireAuth: RequestHandler,
) {
	const router = Router();
	router.get("/", handlers.getAll);
	router.post("/", requireAuth, handlers.addPost);
	router.get("/my", requireAuth, handlers.getMyPosts);
	router.get("/:id", handlers.getById);
	return router;
}
