
import type { PostRepository } from '../domen/post/repository.js';
import type { PostServices } from './post/post.types.js';

export function createPostService( postRepository: PostRepository) : PostServices{
    return{
        async getAll(take, category){
            const posts = await postRepository.getAll(take, category)
            return posts
        },
        
        async getById(id){
            const post = await postRepository.getById(id)
            return post
        },
        
        async addPost(post){
            return await postRepository.addPost(post)
        }
    }
}


