import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 获取随机题目
export const getRandomQuestion = async (userId: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poem_questions/random`, {
            params: { userId }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取随机题目失败');
    }
};

// 提交回答
export const submitAnswer = async (userName: string, userId: number, questionId: number, userAnswer: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/answers/submit`, {
            userName,
            userId,
            questionId,
            userAnswer
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '提交回答失败');
    }
};

// 查询答题记录（分页）
export const getAnswerRecords = async (
    recordId?: number,
    userId?: number,
    questionId?: number,
    userName?: string,
    isCorrect?: boolean,
    current: number = 1,
    size: number = 10
) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/answers`, {
            params: { recordId, userId, questionId, userName, isCorrect, current, size }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取答题记录失败');
    }
};

// 推荐题目
export const getRecommendedQuestions = async (
    userId: number,
    categoryLimit: number = 2,
    limitPerCategory: number = 3
) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poem_questions/recommend`, {
            params: { userId, categoryLimit, limitPerCategory }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取推荐题目失败');
    }
};

