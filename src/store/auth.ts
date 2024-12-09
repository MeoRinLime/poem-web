import { defineStore } from 'pinia';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  bio: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,  // 默认用户未登录
    token: null,  // 登录 token
    username: null,  // 用户名
    bio: null // 用户简介
  }),
  actions: {
    login(token: string, username: string, bio: string) {
      this.isLoggedIn = true;  // 登录时设置为已登录
      this.token = token;  // 保存 token
      this.username = username;  // 设置用户名
      this.bio = bio;  // 设置用户简介
      localStorage.setItem('isLoggedIn', 'true');  // 将登录状态存储到 localStorage
      localStorage.setItem('token', token);  // 保存 token 到 localStorage
      localStorage.setItem('username', username);  // 保存用户名到 localStorage
      localStorage.setItem('bio', bio);  // 保存用户简介到 localStorage
    },
    logout() {
      this.isLoggedIn = false;  // 退出时设置为未登录
      this.token = null;  // 清除 token
      this.username = null;  // 清除用户名
      this.bio = null;  // 清除用户简介
      localStorage.removeItem('isLoggedIn');  // 清除登录状态
      localStorage.removeItem('token');  // 清除 token
      localStorage.removeItem('username');  // 清除用户名
      localStorage.removeItem('bio');  // 清除用户简介
    },
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status;  // 设置登录状态
    },
    initialize() {
      const status = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const bio = localStorage.getItem('bio');
      if (status === 'true' && token && username && bio) {
        this.setLoginStatus(true);
        this.token = token;
        this.username = username;
        this.bio = bio;
      }
    }
  },
});
