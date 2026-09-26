import * as servicesPost from "../../services/post.js";
import type {Response, Request} from "express"
import type { PostResponse} from "../dto/post/responses.js";
import type { QueryParams, RouteParams, PostRequest } from "../dto/post/requestes.js";
import type { MessageErrors } from "../dto/post/errors.js";


export function getAll(req: Request<{}, PostResponse[] | MessageErrors, {}, QueryParams>, res: Response<PostResponse[] | MessageErrors>){
    const {take} = req.query
    const {category} = req.query
    const intTake = Number(take)
    if (intTake && (!Number.isInteger(intTake) || intTake <= 0)){
        res.status(400).json({
            message: "take had to be positive"
        })
        return
    }
    const posts = servicesPost.getAll(intTake, category)
    res.status(200).json(posts) 
}

export function getById(req: Request<RouteParams, PostResponse | MessageErrors, {}, {}>, res: Response<PostResponse | MessageErrors>){
    const {id} = req.params
    const intId = Number(id)
    if (!Number.isInteger(intId) || intId <= 0){
        return res.status(400).json({
            message: "number had to be positive"
        })
    }
    const post = servicesPost.getById(intId)
    if (!post){
        return res.status(404).json({
            message: "post not found"
        })
    }
    return res.status(200).json(post)
}

export async function addPost(req: Request<{}, PostResponse | MessageErrors, PostRequest, QueryParams>, res: Response<PostResponse | MessageErrors>){
    let {id, title, content, author, category} = req.body
    const {fail} = req.query

    if (!title || !content || !author || !category){
        return res.status(400).json({
            message: "all fields are required"
        })
    }
    try {
        const post = await servicesPost.addPost({id, title, content, author, category}, fail)
        return res.status(201).json(post)
    } catch (error) {
        return res.status(400).json({
            message: "incorrect data"
        })
    }
}