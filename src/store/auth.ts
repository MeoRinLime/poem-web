import { defineStore } from 'pinia';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,  // 默认用户未登录
    token: null,  // 登录 token
  }),
  actions: {
    login(token: string) {
      this.isLoggedIn = true;  // 登录时设置为已登录
      this.token = token;  // 保存 token
      localStorage.setItem('isLoggedIn', 'true');  // 将登录状态存储到 localStorage
      localStorage.setItem('token', token);  // 保存 token 到 localStorage
    },
    logout() {
      this.isLoggedIn = false;  // 退出时设置为未登录
      this.token = null;  // 清除 token
      localStorage.removeItem('isLoggedIn');  // 清除登录状态
      localStorage.removeItem('token');  // 清除 token
    },
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status;  // 设置登录状态
    },
    initialize() {
      const status = localStorage.getItem('isLoggedIn');
      const token = localStorage.getItem('token');
      if (status && token) {
        this.setLoginStatus(true);  // 如果 localStorage 中有登录信息，则设置为已登录
        this.token = token;  // 恢复 token
      }
    }
  },
});
