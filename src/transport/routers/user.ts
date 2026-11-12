import { Router } from "express";
import type { UserHandler } from "../handlers/user.js";
import type { RequestHandler } from "express";

export function createUserRouter(
    userHandler: UserHandler,
    requireAuth: RequestHandler
) {
    const router = Router();

    router.post("/register", userHandler.register);
    router.post("/login", userHandler.login);
    router.post("/refresh", userHandler.refresh);
    router.get("/me", requireAuth, userHandler.me);

    return router;
}