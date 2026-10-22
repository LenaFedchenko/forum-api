import type { PostRepository } from "../domain/post/repository.js"
import { db } from "../prisma/db.js"

export function createPostRepository(): PostRepository {
    return {
        async getAll(take, category) {
            let categoryId;

            if (category) {
                const foundCategory = await db.orm.public.Category
                    .where({ name: category })
                    .first();

                if (!foundCategory) return [];

                categoryId = foundCategory.id;
            }

            if (categoryId && take) {
                return await db.orm.public.Post.where({ categoryId }).include("categoryRef").limit(take).all();
            }

            if (categoryId) {
                return await db.orm.public.Post.where({ categoryId }).include("categoryRef").all();
            }

            if (take) {
                return await db.orm.public.Post.include("categoryRef").limit(take).all();
            }

            return await db.orm.public.Post.include("categoryRef").all();
        },

        async getById(id) {
            return await db.orm.public.Post.where({ id: id }).include("categoryRef").first();
        },

        async addPost(post) {
            return await db.orm.public.Post.create({
                title: post.title,
                content: post.content,
                author: post.author,
                category: post.category,
                categoryRef: (category) =>
                    category.connect({ id: post.categoryId! })
            });
        }
    }
}