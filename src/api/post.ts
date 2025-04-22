import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 创建诗歌解析帖子
export const createPost = async (title: string, userName: string, poemTitle: string, poemAuthor: string, content: string, type: number, tag: string[]) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/post`, {
            title,
            userName,
            poemTitle,
            poemAuthor,
            content,
            type,
            tag
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '创建失败');
    }
};

// 获取诗歌解析帖子列表
export const getPoemExplanationList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/getPoemExplanation`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取特定诗歌解析帖子
export const getPostById = async (postId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/getById?postId=${postId}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
}

// 获取日常交流帖子列表
export const getCommunicationList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/getCommunication`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 删除帖子
export const deletePost = async (postIds: number[]) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/post`, {
            data: postIds,
            
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '删除失败');
    }
};