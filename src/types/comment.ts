export interface Comment {
    title?: string;
    commentId: number;
    userName: string;
    content: string;
    createdAt: string;
    countLike: number;
    isLiked: boolean;
    likeId?: number;
    userAvatar?: string;
    objectId: number;
}