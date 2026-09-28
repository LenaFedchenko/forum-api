import { Router } from "express";
import * as handlersPost from "../handlers/post.js";

export function createPostRouter(PostHandler: handlersPost.PostHandler) {
    const router = Router();
    router.get("/", PostHandler.getAll);
    router.get("/:id", PostHandler.getById);
    router.post("/", PostHandler.addPost);
    return router;
}

