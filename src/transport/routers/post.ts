import { type RequestHandler, Router } from "express";
import type { PostHandlers } from "../handlers/post.js";
import { CommentHandlers } from "../handlers/comment.js";


export function createPostRouter(
	handlers: PostHandlers,
	requireAuth: RequestHandler,
	handlersComment: CommentHandlers
) {
	const router = Router();
	router.get("/", handlers.getAll);
	router.post("/", requireAuth, handlers.addPost);
	router.get("/my", requireAuth, handlers.getMyPosts);
	router.get("/:id", handlers.getById);
	router.get("/:postId/comments", handlersComment.getByPostId);
	router.post("/:postId/comments", requireAuth, handlersComment.create);
	return router;
}
