export interface Post {
    id: number;
    title: string;
    content: string | null;
    author: string;
    category: string;
    categoryId: number | null;
}