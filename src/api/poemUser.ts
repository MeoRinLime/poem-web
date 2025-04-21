import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 获取所有用户的诗歌
export const getAllUserPoems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/all`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 分页获取用户的诗歌
export const getPagedUserPoems = async (current : number, size : number = 10) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/paged`, {
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

// 获取用户的诗歌
export const getUserPoem = async (poemId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/getById?poemId=${poemId}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 删除用户的诗歌
export const deleteUserPoem = async (poemIds: number[]) => {
    try {
        const response = await axios.delete(`${BASE_URL}/api/poemUser`, {
            data: poemIds,
            
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '删除失败');
    }
};
