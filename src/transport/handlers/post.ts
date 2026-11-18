import type { Response, Request } from "express"
import type { PostResponse } from "../dto/post/responses.js";
import type { QueryParams, RouteParams, PostRequest } from "../dto/post/requestes.js";
import type { MessageErrors } from "../dto/errors.js";
import type { PostServices } from "../../services/types/post.types.js";
import { hasErrorCode, isUniqueViolation } from "../errors.js";


export interface PostHandler {
    getAll(
        req: Request<{}, PostResponse[] | MessageErrors, {}, QueryParams>,
        res: Response<PostResponse[] | MessageErrors>
    ): Promise<Response<PostResponse[] | MessageErrors> | void>;

    getById(
        req: Request<RouteParams, PostResponse | MessageErrors, {}, {}>,
        res: Response<PostResponse | MessageErrors>
    ): Promise<Response<PostResponse | MessageErrors>>;

    addPost(
        req: Request<{}, PostResponse | MessageErrors, PostRequest, {}>,
        res: Response<PostResponse | MessageErrors>
    ): Promise<Response<PostResponse | MessageErrors>>;
    getMyPosts(
        req: Request<{}, PostResponse[] | MessageErrors, {}, {}>,
        res: Response<PostResponse[] | MessageErrors>
    ): Promise<Response<PostResponse[] | MessageErrors>>;
}


export function createPostHandlers(PostServices: PostServices): PostHandler {
    return {
        async getAll(req, res) {
            const { take } = req.query
            const { category } = req.query
            const intTake = take === undefined ? undefined : Number(take)

            if (
                take !== undefined &&
                (!Number.isInteger(intTake) || intTake! <= 0)
            ) {
                return res.status(400).json({
                    message: "take must be positive"
                })
            }

            try {
                const posts = await PostServices.getAll(intTake, category)
                return res.status(200).json(posts)
            } catch (error) {
                console.error("GET POSTS ERROR:", error)

                return res.status(500).json({
                    message: "internal server error"
                })
            }
        },

        async getById(req, res) {
            const { id } = req.params
            const intId = Number(id)

            if (!Number.isInteger(intId) || intId <= 0) {
                return res.status(400).json({
                    message: "number must be positive"
                })
            }

            try {
                const post = await PostServices.getById(intId)

                if (!post) {
                    return res.status(404).json({
                        message: "post not found"
                    })
                }

                return res.status(200).json(post)
            } catch (error) {
                console.error("GET POST ERROR:", error)

                return res.status(500).json({
                    message: "internal server error"
                })
            }
        },

        async addPost(req, res) {
            const { title, content, categoryId } = req.body ?? {}
            const userId = res.locals.userId
            if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
                return res.status(401).json({
                    message: "unauthorized"
                })
            }

            if (typeof title !== "string" || !title.trim() || categoryId === undefined || categoryId === null) {
                return res.status(422).json({
                    message: "required fields are missing"
                })
            }

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    message: "invalid categoryId"
                })
            }

            if (content !== undefined && content !== null && typeof content !== "string") {
                return res.status(400).json({
                    message: "content must be a string"
                })
            }

            try {
                const post = await PostServices.addPost({
                    title,
                    content: content ?? null,
                    userId: userId,
                    categoryId
                })

                return res.status(201).json(post)
            } catch (error) {
                if (hasErrorCode(error, "CATEGORY_NOT_FOUND")) {
                    return res.status(404).json({
                        message: "category not found"
                    })
                }

                if (hasErrorCode(error, "USER_NOT_FOUND")) {
                    return res.status(404).json({
                        message: "user not found"
                    })
                }

                if (isUniqueViolation(error)) {
                    return res.status(400).json({
                        message: "post with this title already exists"
                    })
                }

                console.error("ADD POST ERROR:", error)

                return res.status(500).json({
                    message: "internal server error"
                })
            }
        },
        async getMyPosts(req, res) {
            const userId = res.locals.userId

            if (typeof userId !== "number" || !Number.isSafeInteger(userId) || userId <= 0) {
                return res.status(401).json({
                    message: "unauthorized"
                })
            }

            try {
                const posts = await PostServices.getPostsByAuthorId(userId)

                return res.status(200).json(posts)
            } catch (error) {
                console.error("GET MY POSTS ERROR:", error)

                return res.status(500).json({
                    message: "internal server error"
                })
            }
        }
    }
}
