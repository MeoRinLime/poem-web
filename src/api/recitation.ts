import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 获取朗读列表
export const getRecitationList = async (current: number, size: number = 6) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/recitation`, {
      params: {
        current,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recitation list:', error);
    throw error;
  }
};

// 获取朗读详情
export const getRecitationDetail = async (recitationId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/recitation`, {
      params: {
        recitationId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recitation detail:', error);
    throw error;
  }
};

// 上传朗读文件
export const uploadRecitation = async (file: File, poemId: number, authorId: number, authorName: string, title: string, content: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('poemId', poemId.toString());
  formData.append('authorId', authorId.toString());
  formData.append('authorName', authorName);
  formData.append('title', title);
  formData.append('content', content);

  try {
    const response = await axios.post(`${BASE_URL}/api/recitation`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading recitation:', error);
    throw error;
  }
};

// 删除朗读文件
export const deleteRecitation = async (recitationId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/recitation`, {
        params: {
            recitationId: recitationId,
        },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting recitation:', error);
    throw error;
  }
};