import type { Response, Request } from "express"
import type { PostResponse } from "../dto/post/responses.js";
import type { QueryParams, RouteParams, PostRequest } from "../dto/post/requestes.js";
import type { MessageErrors } from "../dto/errors.js";
import type { PostServices } from "../../services/types/post.types.js";


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

            const posts = await PostServices.getAll(intTake, category)
            res.status(200).json(posts)
        },

        async getById(req, res) {
            const { id } = req.params
            const intId = Number(id)

            if (!Number.isInteger(intId) || intId <= 0) {
                return res.status(400).json({
                    message: "number must be positive"
                })
            }

            const post = await PostServices.getById(intId)

            if (!post) {
                return res.status(404).json({
                    message: "post not found"
                })
            }

            return res.status(200).json(post)
        },

        async addPost(req, res) {
            const { title, content, author, category, categoryId } = req.body

            if (!title || !author || !category) {
                return res.status(422).json({
                    message: "required fields are missing"
                })
            }

            if (!Number.isInteger(categoryId) || categoryId <= 0) {
                return res.status(400).json({
                    message: "invalid categoryId"
                })
            }

            const post = await PostServices.addPost({
                title,
                content,
                author,
                category,
                categoryId
            })

            return res.status(201).json(post)
        }
    }
}