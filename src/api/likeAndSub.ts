import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// interface LikeRequest {
//     objectId: number; // 对象ID
//     objectType: number; // 评论对象类型 (0: 帖子, 1: 用户诗歌, 2: 诗人诗歌, 3: 朗诵, 4: 评论)
//     userName: string; // 点赞用户的用户名
// }

// interface SubRequest {
//     objectId: number; // 对象ID
//     objectType: number; // 评论对象类型 (0: 帖子, 1: 用户诗歌, 2: 诗人诗歌, 3: 朗诵)
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

// 取消点赞
//body
// {
//     ids: Number
// } 
export const cancelLike = async (ids: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/objectLike?ids=${ids}`
        );
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


// 取消关注
export const cancelSubscribe = async (ids: string) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/favorites?ids=${ids}`);
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
