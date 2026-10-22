import { Router } from "express";
import * as handlersCategory from "../handlers/category.js";

export function createCategoryRouter(
    CategoryHandler: handlersCategory.CategoryHandler
) {
    const router = Router();

    router.get("/", CategoryHandler.getAll);
    router.get("/:id", CategoryHandler.getById);
    router.post("/", CategoryHandler.addCategory);

    return router;
}