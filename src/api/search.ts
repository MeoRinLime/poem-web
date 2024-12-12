import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/poem/query';

export const search = async (keyWord: string) => {
    try {
        const response = await axios.get(`${BASE_URL}?keyWord=${keyWord}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '搜索失败');
    }
};