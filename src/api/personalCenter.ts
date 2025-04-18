import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 获取用户诗歌、帖子、评论数量
export const getUserCountInfo = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poem/getUserCountInfo?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的诗歌
export const getUserPoems = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的帖子
export const getUserPosts = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的评论
export const getUserComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};


// 获取用户收藏列表
export const getUserFavorites = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/post/favorite`, {
            params: {
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取收藏列表失败');
    }
};

// 新用户信息
export const updateUserInfo = async (id: string, bio: string, email: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/webUsers/info`, {
        id,
        bio,
        email,
        });
        return response.data; // 返回更新成功的数据
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新用户信息失败');
    }
}

// 头像获取
export const getUserAvatar = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/webUsers/avatar`, {
            params: {
                id
            },
            responseType: 'blob', // 设置响应类型为 blob
        });
        const base64 = await blobToBase64(response.data);
        return base64; // 返回 base64 字符串
    }
    catch (error: any) {
        throw new Error(error.response?.data?.message || '获取用户头像失败');
    }
};

export const getUserAvatarByUsername = async (username: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/webUsers/avatar`, {
            params: { username },
            responseType: 'blob',
        });

        const base64 = await blobToBase64(response.data);
        return base64; // 返回 base64 字符串
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取用户头像失败');
    }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};


//修改用户头像
export const updateUserAvatar = async (file: File, id: number, username: string, email: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    formData.append('username', username);
    formData.append('email', email);

    try {
        const response = await axios.post(`${BASE_URL}/api/webUsers/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // 返回更新成功的数据
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '更新用户头像失败');
    }
};