import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/web-login`, {
      username, // 用户名或邮箱
      password,
    });
    return response.data; // 返回登录成功的数据
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '登录失败');
  }
};

export const logout = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '退出登录失败');
  }
}

export const register = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }

    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username,
      email,
      password,
      confirmPassword
    });
    return response.data; 
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || '注册失败');
    } else if (error.request) {
      throw new Error('无法连接服务器，请检查网络');
    } else {
      throw error;
    }
  }
};