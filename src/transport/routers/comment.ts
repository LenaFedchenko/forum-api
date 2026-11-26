import { Router, RequestHandler } from "express";
import { CommentHandlers, CommentIdParams } from "../handlers/comment.js";

export function createCommentRouter(
    handlers: CommentHandlers,
    requireAuth: RequestHandler
,) {
    const router = Router();
    router.delete("/:commentId", requireAuth, handlers.delete);
    return router;
}

