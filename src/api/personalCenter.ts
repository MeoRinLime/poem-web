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

// 获取用户的朗诵
export const getUserRecitations = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/recitation/my?userName=${userName}`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户的评论
// type（帖子类型）: 0:post,1:poemUser,2:poemPoet,3:recitation

// 获取用户帖子评论
export const getUserPostComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}&type=0`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户用户诗歌评论
export const getUserPoemComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}&type=1`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户诗人诗歌评论
export const getUserPoetComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}&type=2`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户朗诵评论
export const getUserReciteComments = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/comment/my?userName=${userName}&type=3`);
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取失败');
    }
};

// 获取用户收藏诗人诗歌
export const getUserPoetPoemFavorites = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemPoet/favorite`, {
            params: {
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取收藏列表失败');
    }
};

// 获取用户收藏用户诗歌
export const getUserUserPoemFavorites = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/poemUser/favorite`, {
            params: {
                userName
            }
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || '获取收藏列表失败');
    }
};

// 获取用户收藏帖子
export const getUserPostFavorites = async (userName: string) => {
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

// 获取用户收藏朗诵
export const getUserReciteFavorites = async (userName: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/recitation/favorite`, {
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
    // 从本地存储中获取缓存的 ETag 和 Last-Modified
    const eTag = localStorage.getItem(`avatar-etag-${id}`);
    const lastModified = localStorage.getItem(`avatar-lastModified-${id}`);
    // 构建请求头
    const headers: Record<string, string> = {};
    if (eTag) headers['If-None-Match'] = eTag;
    if (lastModified) headers['If-Modified-Since'] = lastModified;
     
    // 发送请求
    const response = await axios.get(`${BASE_URL}/api/webUsers/avatar`, {
        params: { id },
        headers,
        responseType: 'blob',
        validateStatus: (status) => status === 200 || status === 304,
    });
     
    if (response.status === 304) {
         // 资源未修改，可使用缓存
        const cachedBase64 = localStorage.getItem(`avatar-base64-${id}`);
        if (cachedBase64) return cachedBase64;
        throw new Error('缓存中未找到头像数据');
    }
     
    // 资源已更新，处理新的头像数据
    const base64 = await blobToBase64(response.data);
     
    // 更新本地存储的缓存数据
    const newETag = response.headers['etag'];
    const newLastModified = response.headers['last-modified'];
    if (newETag) localStorage.setItem(`avatar-etag-${id}`, newETag);
    if (newLastModified) localStorage.setItem(`avatar-lastModified-${id}`, newLastModified);
    localStorage.setItem(`avatar-base64-${id}`, base64);
     
    return base64;
    } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取用户头像失败');
      }
};

export const getUserAvatarByUsername = async (username: string) => {
    try {
    // 从本地存储中获取缓存的 ETag 和 Last-Modified
    const eTag = localStorage.getItem(`avatar-etag-${username}`);
    const lastModified = localStorage.getItem(`avatar-lastModified-${username}`);
    // 构建请求头
    const headers: Record<string, string> = {};
    if (eTag) headers['If-None-Match'] = eTag;
    if (lastModified) headers['If-Modified-Since'] = lastModified;
     
    // 发送请求
    const response = await axios.get(`${BASE_URL}/api/webUsers/avatar`, {
        params: { username },
        headers,
        responseType: 'blob',
        validateStatus: (status) => status === 200 || status === 304,
    });
     
    if (response.status === 304) {
         // 资源未修改，可使用缓存
        const cachedBase64 = localStorage.getItem(`avatar-base64-${username}`);
        if (cachedBase64) return cachedBase64;
        throw new Error('缓存中未找到头像数据');
    }
     
    // 资源已更新，处理新的头像数据
    const base64 = await blobToBase64(response.data);
     
    // 更新本地存储的缓存数据
    const newETag = response.headers['etag'];
    const newLastModified = response.headers['last-modified'];
    if (newETag) localStorage.setItem(`avatar-etag-${username}`, newETag);
    if (newLastModified) localStorage.setItem(`avatar-lastModified-${username}`, newLastModified);
    localStorage.setItem(`avatar-base64-${username}`, base64);
     
    return base64;
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
export const updateUserAvatar = async (file: File, id: string, username: string, email: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);
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