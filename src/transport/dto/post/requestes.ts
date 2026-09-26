export interface QueryParams{
    take: string | undefined
    category: string 
    fail: boolean
}
export interface RouteParams{
    id: string | undefined
}
export interface PostRequest{
    id: number
    title: string
    content: string
    author: string
    category: string
}