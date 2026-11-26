import type { CommentRepository } from "../../domain/comment/repository.js";
import type { PostRepository } from "../../domain/post/repository.js";
import type { CommentService } from "./comment.types.js";

const MAX_CONTENT_LENGTH = 500;

export function createCommentService(
    commentRepository: CommentRepository,
    postRepository: PostRepository,
): CommentService {
    return {
        async getByPostId(postId) {
          //лишний запрос
            const post = await postRepository.getById(postId);
            if (!post) throw new Error("POST_NOT_FOUND");

            return commentRepository.getByPostId(postId);
        },

        async create(input) {
            const trimmed = input.content.trim();
            // MAX_CONTENT_LENGTH; к хендлеру
            if (trimmed.length < 1 || trimmed.length > MAX_CONTENT_LENGTH) {
                throw new Error("INVALID_COMMENT_CONTENT");
            }
            // лишний запрос
            const post = await postRepository.getById(input.postId);
            if (!post) throw new Error("POST_NOT_FOUND");

            return commentRepository.create({
                postId: input.postId,
                authorId: input.authorId,
                content: trimmed,
            });
        },

        async delete(commentId, userId) {
          // вынести в вере
            const comment = await commentRepository.getById(commentId);
            if (!comment) {
                throw new Error("COMMENT_NOT_FOUND");
            }

            if (comment.authorId !== userId) {
                throw new Error("FORBIDDEN");
            }

            await commentRepository.delete(commentId);
        },
    };
}
