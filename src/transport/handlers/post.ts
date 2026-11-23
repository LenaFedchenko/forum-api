import type { RequestHandler } from "express";
import type { PostService } from "../../services/post/post.types.js";
import type { ErrorResponse, IdParams, NoParams } from "../dto/common.js";
import type { CreatePostRequest, PostsQuery } from "../dto/post/requests.js";
import type { PostResponse } from "../dto/post/responses.js";

export interface PostHandlers {
	getAll: RequestHandler<
		NoParams,
		PostResponse[] | ErrorResponse,
		unknown,
		PostsQuery
	>;
	getById: RequestHandler<IdParams, PostResponse | ErrorResponse>;
	addPost: RequestHandler<
		NoParams,
		PostResponse | ErrorResponse,
		CreatePostRequest
	>;
	getMyPosts: RequestHandler<NoParams, PostResponse[] | ErrorResponse>;
}

export function createPostHandlers(postService: PostService): PostHandlers {
	return {
		async getAll(req, res) {
			const { take, category } = req.query;
			const intTake = take === undefined ? undefined : Number(take);

			if (
				intTake !== undefined &&
				(!Number.isInteger(intTake) || intTake <= 0)
			) {
				res.status(400).json({ message: "take must be a positive integer" });
				return;
			}

			try {
				const posts = await postService.getAll({ take: intTake, category });
				res.status(200).json(posts);
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async getById(req, res) {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				res.status(400).json({ message: "id must be a positive integer" });
				return;
			}

			try {
				const post = await postService.getById(id);
				if (!post) {
					res.status(404).json({ message: "Post not found" });
					return;
				}
				res.status(200).json(post);
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async addPost(req, res) {
			const userId = res.locals.userId;
			if (userId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			const { title, content, categoryId } = req.body ?? {};

			if (
				typeof title !== "string" ||
				!title.trim() ||
				categoryId === undefined ||
				categoryId === null
			) {
				res.status(422).json({ message: "Invalid post data" });
				return;
			}

			if (!Number.isInteger(categoryId) || categoryId <= 0) {
				res.status(422).json({ message: "Invalid post data" });
				return;
			}

			if (
				content !== undefined &&
				content !== null &&
				typeof content !== "string"
			) {
				res.status(422).json({ message: "Invalid post data" });
				return;
			}

			try {
				const post = await postService.addPost({
					title,
					content: content ?? null,
					categoryId,
					userId,
				});
				res.status(201).json(post);
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === "CATEGORY_NOT_FOUND") {
						res.status(404).json({ message: "Category not found" });
						return;
					}
					if (error.message === "USER_NOT_FOUND") {
						res.status(404).json({ message: "User not found" });
						return;
					}
					if (error.message === "POST_ALREADY_EXISTS") {
						res.status(409).json({ message: "Post already exists" });
						return;
					}
				}
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},

		async getMyPosts(_req, res) {
			const userId = res.locals.userId;
			if (userId === undefined) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			try {
				const posts = await postService.getPostsByAuthorId(userId);
				res.status(200).json(posts);
			} catch (error) {
				console.error(error);
				res.status(500).json({ message: "Internal server error" });
			}
		},
	};
}
