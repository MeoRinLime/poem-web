import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const createPost = async (title: string, userName: string, poemTitle: string, poemAuthor: string, content: string, type: number, tag: string[]) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/post/create`, {
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

// GET
// http://localhost:8000/api/post/getPoemExplanation
// [
//     {
//         "commentCount": 1,
//         "content": "从诗中感受古人对家乡的眷恋",
//         "poemAuthor": "李白",
//         "poemTitle": "静夜思",
//         "postId": 1,
//         "tag": [
//             "夜",
//             "小园",
//             "唐诗"
//         ],
//         "title": "月光下的乡愁"
//     },
//     {
//         "commentCount": 0,
//         "content": "财政学财政学自行车自行车在",
//         "poemAuthor": "王之涣",
//         "poemTitle": "登鹳雀楼",
//         "postId": 2,
//         "tag": [
//             "边塞诗"
//         ],
//         "title": "陆游的诗歌鉴赏"
//     }
// ]

export const getPoemExplanationList = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/getPoemExplanation`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};