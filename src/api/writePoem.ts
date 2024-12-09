import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/poemUser/create';

export const writePoem = async (title: string, authorName: string, content: string, subTitle?: string) => {
    try {
        const response = await axios.post(`${BASE_URL}`, {
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
