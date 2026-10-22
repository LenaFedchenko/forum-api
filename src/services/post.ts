import type { PostRepository } from '../domain/post/repository.js';
import type { CategoryRepository } from '../domain/category/repository.js';
import type { PostServices } from './types/post.types.js';

export function createPostService(
    postRepository: PostRepository,
    categoryRepository: CategoryRepository
): PostServices {
    return {
        async getAll(take, category) {
            const posts = await postRepository.getAll(take, category);
            return posts;
        },

        async getById(id) {
            const post = await postRepository.getById(id);
            return post;
        },

        async addPost(post) {
            if (post.categoryId === null) {
                throw new Error("CATEGORY_ID_REQUIRED");
            }

            const category = await categoryRepository.getById(post.categoryId);

            if (!category) {
                throw new Error("CATEGORY_NOT_FOUND");
            }

            return await postRepository.addPost(post);
        }
    };
}