import { Router } from "express";
import * as handlersPost from "../handlers/post.js";

const router = Router();

router.get("/", handlersPost.getAll);
router.get("/:id", handlersPost.getById);
router.post("/", handlersPost.addPost);

export default router;
