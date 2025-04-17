import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/recitation';

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
    const response = await axios.post(`${BASE_URL}`, formData, {
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
    const response = await axios.delete(`${BASE_URL}`, {
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