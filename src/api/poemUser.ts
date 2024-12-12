import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

// 获取所有用户的诗歌
export const getAllUserPoems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/all`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的诗歌
export const getUserPoem = async (poemId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/getById?poemId=${poemId}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};