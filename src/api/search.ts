import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const search = async (keyWord: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poem/query?keyWord=${keyWord}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '搜索失败');
    }
};