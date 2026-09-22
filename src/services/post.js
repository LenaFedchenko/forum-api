import * as PostsRepo from '../repositories/post.js';

export function getAll(take, category){
    const posts = PostsRepo.getAll(take, category)
    return posts
}

export function getById(id){
    const post = PostsRepo.getById(id)
    return post
}

export async function addPost(post, fail){
    return await PostsRepo.addPost(post, fail)
}
