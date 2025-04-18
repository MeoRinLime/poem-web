import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const writePoem = async (title: string, authorName: string, content: string, subTitle?: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/poemUser/create`, {
        title,
        authorName,
        content,
        subTitle
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '创建失败');
    }
}
