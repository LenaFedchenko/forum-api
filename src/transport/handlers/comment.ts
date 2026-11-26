import type { RequestHandler } from "express";
import { CreateCommentRequest } from "../dto/comments/requests.js";
import { ErrorResponse } from "../dto/common.js";
import { CommentResponse } from "../dto/comments/response.js";
import type { CommentService } from "../../services/comment/comment.types.js";

export interface PostIdParams {
	postId: string;
}

export interface CommentIdParams {
	commentId: string;
}

// export interface CommentHandlers {
// 	getByPostId: RequestHandler<PostIdParams, CommentResponse[] | ErrorResponse>;
// 	create: RequestHandler<
// 		PostIdParams,
// 		CommentResponse | ErrorResponse,
// 		Partial<CreateCommentRequest>
// 	>;
// 	delete: RequestHandler<CommentIdParams, void | ErrorResponse>;
// }

export interface CommentHandlers {
	getByPostId: RequestHandler<
		Record<string, string>,
		CommentResponse[] | ErrorResponse
	>;
	create: RequestHandler<
		Record<string, string>,
		CommentResponse | ErrorResponse,
		Partial<CreateCommentRequest>
	>;
	delete: RequestHandler<
		Record<string, string>,
		void | ErrorResponse
	>;
}

export function createCommentHandlers(
    CommentService: CommentService,
): CommentHandlers {
    return {
        async getByPostId(req, res) {
            const postId = Number(req.params.postId);

            if (!Number.isInteger(postId) || postId <= 0) {
                return res.status(500).json({ message: "Internal server error" });
            }

            try {
                const comments = await CommentService.getByPostId(postId);
                res.status(200).json(comments);
            } catch (error) {
                console.error(error);

                res.status(500).json({ message: "Internal server error" });
            }
        },
        async create(req, res) {
            try {
                const userId = Number(res.locals.userId);
                if (!Number.isInteger(userId) || userId <= 0) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const postId = Number(req.params.postId);
                if (!Number.isInteger(postId) || postId <= 0) {
                    return res.status(500).json({ message: "Internal server error" });
                }

                const { content } = req.body ?? {};

                if (typeof content !== "string" || !content.trim()) {
                    res.status(400).json({ message: "Content is required" });
                    return;
                }

                const comment = await CommentService.create({
                    postId,
                    authorId: userId,
                    content: content.trim(),
                });

                res.status(201).json(comment);
            } catch (error) {
                console.error(error);

                res.status(500).json({ message: "Internal server error" });
            }
        },
        async delete(req, res) {
            try {
                const userId = Number(res.locals.userId);

                if (!Number.isInteger(userId) || userId <= 0) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const commentId = Number(req.params.commentId);
                if (!Number.isInteger(commentId) || commentId <= 0) {
                    return res.status(500).json({ message: "Internal server error" });
                }

                await CommentService.delete(commentId, userId);
                res.status(204).send();
            } catch (error) {
                console.error(error);

                res.status(500).json({ message: "Internal server error" });
            }
        },
    };
}