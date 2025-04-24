import type { Comment } from './comment'

// 创作诗歌
export interface WritePoem {
    title: string
    subtitle?: string
    content: string
    author: string
}

// 展示诗歌
export interface Poem {
    poemId: number
    authorName: string
    title: string
    subTitle?: string
    content: string
    createdAt: string
    commentCount: number
    comments: Comment[]
    likeCount: number
    likeId?: number
    favoriteCount: number
    favoritesId?: number
  }

// 用户诗歌
export interface UserPoem extends Poem {
    avatarUrl: string
    avatarLoaded: boolean
}

// 诗人诗歌
export interface PoetPoem extends Poem {
    dynasty: string
}