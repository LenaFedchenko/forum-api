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
                return await db.orm.public.Post.where({ categoryId }).include("category").include("user").limit(take).all();
            }

            if (categoryId) {
                return await db.orm.public.Post.where({ categoryId }).include("category").include("user").all();
            }

            if (take) {
                return await db.orm.public.Post.include("category").include("user").limit(take).all();
            }

            return await db.orm.public.Post.include("category").include("user").all();
        },

        async getById(id) {
            return await db.orm.public.Post.where({ id: id }).include("category").include("user").first();
        },

        async addPost(post) {
            console.log("USER ID:", post.userId)
            return await db.orm.public.Post.include("category").include("user").create({
                title: post.title,
                content: post.content,
                categoryId: post.categoryId,
                userId: post.userId
            });
        },
        async getPostsByAuthorId(userId) {
            return await db.orm.public.Post
                .where({ userId })
                .include("category")
                .include("user")
                .all();
        }
    }
}