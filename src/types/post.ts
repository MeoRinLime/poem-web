import type { Comment } from './comment'
export interface Post {
    postId: number
    title: string
    poemTitle: string
    poemAuthor: string
    userName: string
    content: string
    commentCount: number
    createdAt: String
    tags?: string[]
    avatarUrl?: string
    avatarLoaded?: boolean
}

export interface PostDetail extends Post {
    comments: Comment[]
    likeCount: number
    favoriteCount: number
    likeId?: number
    favoritesId?: string
}
