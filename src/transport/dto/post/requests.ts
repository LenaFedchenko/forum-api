export interface PostsQuery {
	take?: string;
	// имя категории
	category?: string;
}

export interface CreatePostRequest {
	title: string;
	content?: string | null;
	categoryId: number;
}
