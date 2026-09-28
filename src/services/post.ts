
import type { PostRepository } from '../domen/post/repository.js';
import type { PostServices } from './post/post.types.js';

export async function createPostService( postRepository: PostRepository) :Promise<PostServices>{
    return{
        getAll(take, category){
            const posts = postRepository.getAll(take, category)
            return posts
        },
        
        getById(id){
            const post = postRepository.getById(id)
            return post
        },
        
        async addPost(post, fail){
            return await postRepository.addPost(post, fail)
        }
    }
}


