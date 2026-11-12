import { Router, type RequestHandler } from "express";
import * as handlersPost from "../handlers/post.js";

export function createPostRouter(PostHandler: handlersPost.PostHandler, requireAuth: RequestHandler) {
    const router = Router();
    router.get("/", PostHandler.getAll);
    router.post("/", requireAuth, PostHandler.addPost)
    router.get("/my", requireAuth, PostHandler.getMyPosts);
    router.get("/:id", PostHandler.getById);
    return router;
}

