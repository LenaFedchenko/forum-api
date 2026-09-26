import * as PostsRepo from '../repositories/post.js';
import type { Post } from '../transport/dto/post/postes.js';

export function getAll(take: number, category: string){
    const posts = PostsRepo.getAll(take, category)
    return posts
}

export function getById(id: number){
    const post = PostsRepo.getById(id)
    return post
}

export async function addPost(post: Post, fail: boolean){
    return await PostsRepo.addPost(post, fail)
}
