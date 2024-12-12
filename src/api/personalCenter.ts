import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// 获取用户诗歌、帖子、评论数量
export const getUserCountInfo = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poem/getUserCountInfo?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的诗歌
export const getUserPoems = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的帖子
export const getUserPosts = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的评论
export const getUserComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};


// 获取用户收藏列表
export const getUserFavorites = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/favorite`, {
            params: {
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取收藏列表失败');
    }
};