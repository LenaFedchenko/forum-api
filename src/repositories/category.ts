import type { PostgresClient } from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d.js";
import type { CategoryRepository } from "../domain/category/repository.js";

export function createCategoryRepository(
    db: PostgresClient<Contract>
): CategoryRepository {
    return {
        async getAll() {
            return await db.orm.public.Category.all();
        },

        async getById(id) {
            return await db.orm.public.Category
                .where({ id })
                .first();
        },

        async addCategory(category) {
            return await db.orm.public.Category.create(category);
        }
    };
}