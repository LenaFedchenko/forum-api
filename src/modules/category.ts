import type { Database } from "../prisma/db.js";
import { createCategoryRepository } from "../repositories/category.js";
import { createCategoryService } from "../services/category/category.js";
import { createCategoryHandlers } from "../transport/handlers/category.js";
import { createCategoryRouter } from "../transport/routers/category.js";

export function createCategoryModule(db: Database) {
	const repository = createCategoryRepository(db);
	const service = createCategoryService(repository);
	return createCategoryRouter(createCategoryHandlers(service));
}
