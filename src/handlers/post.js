import * as servicesPost from "../services/post.js";

export function getAll(req, res){
    const {take} = req.query
    const {category} = req.query
    const intTake = Number(take)
    if (intTake && (!Number.isInteger(intTake) || intTake <= 0)){
        return res.status(400).json({
            message: "take had to be positive"
        })
    }
    const posts = servicesPost.getAll(intTake, category)
    return res.status(200).json({
        posts
    }) 
}

export function getById(req, res){
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
    return res.status(200).json({post})
}

export async function addPost(req, res){
    let {title, content, author, category} = req.body
    const {fail} = req.query
    if (!title || !content || !author || !category){
        return res.status(400).json({
            message: "all fields are required"
        })
    }
    try {
        const posts = await servicesPost.addPost({title, content, author, category}, fail)
        return res.status(201).json({
            message: "post added successfully",
            posts
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}