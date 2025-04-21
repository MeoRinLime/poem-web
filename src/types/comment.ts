export interface Comment {
    title?: string;
    commentId: number;
    userName: string;
    content: string;
    createdAt: string;
    countLike: number;
    isLiked: boolean;
    likeId?: number | string;
    userAvatar?: string;
    objectId: number;
}