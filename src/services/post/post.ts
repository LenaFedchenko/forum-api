import type { PostRepository } from "../../domain/post/repository.js";
import type { PostService } from "./post.types.js";

export function createPostService(postRepository: PostRepository): PostService {
	return {
		getAll(filter) {
			return postRepository.getAll(filter);
		},

		getById(id) {
			return postRepository.getById(id);
		},

		// несуществующие категорию и автора ловит репозиторий
		addPost(input) {
			return postRepository.create(input);
		},

		getPostsByAuthorId(userId) {
			return postRepository.getPostsByAuthorId(userId);
		},
	};
}
