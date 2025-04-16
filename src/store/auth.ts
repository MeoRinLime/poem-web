import { defineStore } from 'pinia';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  username: string | null;
  bio: string | null;
  createTime: string | null;
  email: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,  // 默认用户未登录
    token: null,  // 登录 token
    username: null,  // 用户名
    bio: null, // 用户简介
    createTime: null, // 用户创建时间
    email : null, // 用户邮箱
  }),
  actions: {
    login(token: string, username: string, bio: string, createTime: string, email: string, rememberMe: boolean) {
      this.isLoggedIn = true;  // 登录时设置为已登录
      this.token = token;  // 保存 token
      this.username = username;  // 设置用户名
      this.bio = bio;  // 设置用户简介
      this.createTime = createTime;  // 设置用户创建时间
      this.email = email; // 设置用户邮箱

      if (rememberMe) {
        console.log("rememberMe is true, saving to localStorage");
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('bio', bio);
        localStorage.setItem('createTime', this.createTime);
        localStorage.setItem('email', email);
      } else {
        console.log("rememberMe is false, saving to sessionStorage");
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('bio', bio);
        sessionStorage.setItem('createTime', this.createTime);
        sessionStorage.setItem('email', email);
      }
    },
    logout() {
      this.isLoggedIn = false;  // 退出时设置为未登录
      this.token = null;  // 清除 token
      this.username = null;  // 清除用户名
      this.bio = null;  // 清除用户简介
      this.createTime = null;  // 清除用户创建时间
      this.email = null; // 清除用户邮箱

      // 清除 localStorage 中的登陆状态和登录信息
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('bio');
      localStorage.removeItem('createTime');
      localStorage.removeItem('email');

      // 清除 sessionStorage 中的登陆状态和登录信息
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('bio');
      sessionStorage.removeItem('createTime');
      sessionStorage.removeItem('email');
    },
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status;  // 设置登录状态
    },
    initialize() {
      const status = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const username = localStorage.getItem('username') || sessionStorage.getItem('username');
      const bio = localStorage.getItem('bio') || sessionStorage.getItem('bio');
      const createTime = localStorage.getItem('createTime') || sessionStorage.getItem('createTime');
      const email = localStorage.getItem('email') || sessionStorage.getItem('email');
      if (status === 'true' && token && username && bio !== null) {
        this.setLoginStatus(true);
        this.token = token;
        this.username = username;
        this.bio = bio;
        this.createTime = createTime;
        this.email = email;
      }      
    }
  },
});
