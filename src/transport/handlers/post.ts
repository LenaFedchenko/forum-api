import type {Response, Request} from "express"
import type { PostResponse} from "../dto/post/responses.js";
import type { QueryParams, RouteParams, PostRequest } from "../dto/post/requestes.js";
import type { MessageErrors } from "../dto/post/errors.js";
import type { PostServices } from "../../services/post/post.types.js";



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


export function createPostHandlers(PostServices: PostServices) : PostHandler {
    return {
        async getAll(req, res){
            const {take} = req.query
            const {category} = req.query
            const intTake = Number(take)
            if (intTake && (!Number.isInteger(intTake) || intTake <= 0)){
                res.status(400).json({
                    message: "take had to be positive"
                })
                return
            }
            const posts = await PostServices.getAll(intTake, category)
            res.status(200).json(posts) 
        },

        async getById(req, res){
            const {id} = req.params
            const intId = Number(id)
            if (!Number.isInteger(intId) || intId <= 0){
                return res.status(400).json({
                    message: "number had to be positive"
                })
            }
            const post = await PostServices.getById(intId)
            if (!post){
                return res.status(404).json({
                    message: "post not found"
                })
            }
            return res.status(200).json(post)
        },
        
        async addPost(req, res){
            let {id, title, content, author, category} = req.body
        
            if (!title || !content || !author || !category){
                return res.status(400).json({
                    message: "all fields are required"
                })
            }
            try {
                const post = await PostServices.addPost({id, title, content, author, category})
                return res.status(201).json(post)
            } catch (error) {
                return res.status(400).json({
                    message: "incorrect data"
                })
            }
        }
    }
}