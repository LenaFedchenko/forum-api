import type { PostRepository } from '../domain/post/repository.js';
import type { CategoryRepository } from '../domain/category/repository.js';
import type { PostServices } from './types/post.types.js';
import type { UserRepository } from '../domain/user/repository.js';

export function createPostService(
    postRepository: PostRepository,
    categoryRepository: CategoryRepository,
    userRepository: UserRepository
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
            const user = await userRepository.getUserById(post.userId);
            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }
            const postWithUserCategory = {
                ...post,
                category: category,
                user: user,
            };

            return await postRepository.addPost(postWithUserCategory);
        },
        async getPostsByAuthorId(userId) {
            const posts = await postRepository.getPostsByAuthorId(userId);
            return posts;
        }
    };
}