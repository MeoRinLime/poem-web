import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// interface LikeRequest {
//     objectId: number; // 对象ID
//     objectType: number; // 评论对象类型 (0: 帖子, 1: 用户诗歌, 2: 诗人诗歌, 3: 朗诵, 4: 评论, 5: 每日一诗讨论)
//     userName: string; // 点赞用户的用户名
// }

// interface SubRequest {
//     objectId: number; // 对象ID
//     objectType: number; // 评论对象类型 (0: 帖子, 1: 用户诗歌, 2: 诗人诗歌, 3: 朗诵, 4: 评论, 5: 每日一诗讨论)
//     userName: string; // 关注用户的用户名
// }

// 点赞公共接口
export const like = async (objectId: number, objectType: number, userName: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/objectLike`, {
            objectId,
            objectType,
            userName
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '点赞失败');
    }
};

// 点赞帖子
export const likePost = async (objectId: number, userName: string) => {
    return like(objectId, 0, userName);
};

// 点赞用户诗歌
export const likeUserPoem = async (objectId: number, userName: string) => {
    return like(objectId, 1, userName);
};

// 点赞诗人诗歌
export const likePoetPoem = async (objectId: number, userName: string) => {
    return like(objectId, 2, userName);
};

// 点赞朗诵
export const likeRecitation = async (objectId: number, userName: string) => {
    return like(objectId, 3, userName);
};

// 点赞评论
export const likeComment = async (objectId: number, userName: string) => {
    return like(objectId, 4, userName);
};

// 点赞每日一诗讨论
export const likeDailyPoemDiscussion = async (objectId: number, userName: string) => {
    return like(objectId, 5, userName);
};

// 更新：取消点赞接口，支持 type 和 ids 列表
export const cancelLike = async (type: number, objectId: number[]) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/objectLike?type=${type}`, {
            data: objectId
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '取消点赞失败');
    }
};

// 查询是否点赞公共接口
export const isLike = async (objectId: number, objectType: number, userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/objectLike/isLike`, {
            params: {
                objectId,
                objectType,
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '查询失败');
    }
}

// 查询是否点赞帖子
export const isLikePost = async (objectId: number, userName: string) => {
    return isLike(objectId, 0, userName);
};

// 查询是否点赞用户诗歌
export const isLikeUserPoem = async (objectId: number, userName: string) => {
    return isLike(objectId, 1, userName);
};

// 查询是否点赞诗人诗歌
export const isLikePoetPoem = async (objectId: number, userName: string) => {
    return isLike(objectId, 2, userName);
};

// 查询是否点赞朗诵
export const isLikeRecitation = async (objectId: number, userName: string) => {
    return isLike(objectId, 3, userName);
};

// 查询是否点赞评论
export const isLikeComment = async (objectId: number, userName: string) => {
    return isLike(objectId, 4, userName);
};

// 查询是否点赞每日一诗讨论
export const isLikeDailyPoemDiscussion = async (objectId: number, userName: string) => {
    return isLike(objectId, 5, userName);
};

// 关注公共接口
export const subscribe = async (objectId: number, objectType: number, userName: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/favorites`, {
            objectId,
            objectType,
            userName
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '关注失败');
    }
};

// 关注帖子
export const subscribePost = async (objectId: number, userName: string) => {
    return subscribe(objectId, 0, userName);
};

// 关注用户诗歌
export const subscribeUserPoem = async (objectId: number, userName: string) => {
    return subscribe(objectId, 1, userName);
};

// 关注诗人诗歌
export const subscribePoetPoem = async (objectId: number, userName: string) => {
    return subscribe(objectId, 2, userName);
};

// 关注朗诵
export const subscribeRecitation = async (objectId: number, userName: string) => {
    return subscribe(objectId, 3, userName);
};

// 关注评论，用不到
export const subscribeComment = async (objectId: number, userName: string) => {
    return subscribe(objectId, 4, userName);
};

// 关注每日一诗讨论
export const subscribeDailyPoemDiscussion = async (objectId: number, userName: string) => {
    return subscribe(objectId, 5, userName);
};

// 取消收藏接口，支持 type 和 ids 列表
export const cancelSubscribe = async (type: number, objectId: number[]) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/favorites?type=${type}`, {
            data: objectId
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '取消关注失败');
    }
};

// 查询是否关注公共接口
export const isSubscribe = async (objectId: number, objectType: number, userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/favorites/isBeFavourited`, {
            params: {
                objectId,
                objectType,
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '查询失败');
    }
}

// 查询是否关注帖子
export const isSubscribePost = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 0, userName);
};

// 查询是否关注用户诗歌
export const isSubscribeUserPoem = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 1, userName);
};

// 查询是否关注诗人诗歌
export const isSubscribePoetPoem = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 2, userName);
};

// 查询是否关注朗诵
export const isSubscribeRecitation = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 3, userName);
};

// 查询是否关注评论，用不到
export const isSubscribeComment = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 4, userName);
};

// 查询是否关注每日一诗讨论
export const isSubscribeDailyPoemDiscussion = async (objectId: number, userName: string) => {
    return isSubscribe(objectId, 5, userName);
};