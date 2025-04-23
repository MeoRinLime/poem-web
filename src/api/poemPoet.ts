import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 获取所有诗人的诗歌
export const getAllPoetPoems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemPoet/all`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 分页获取诗人的诗歌
export const getPagedPoetPoems = async (current : number, size : number = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemPoet/paged`, {
            params: {
                current,
                size,
            },
        });
        return response;
    }
    catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取诗人的诗歌
export const getPoetPoem = async (poemId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemPoet/getById?poemId=${poemId}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};