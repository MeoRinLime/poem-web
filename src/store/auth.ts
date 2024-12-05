import { defineStore } from 'pinia';

interface AuthState {
  isLoggedIn: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,  // 默认用户未登录
  }),
  actions: {
    login() {
      this.isLoggedIn = true;  // 登录时设置为已登录
      localStorage.setItem('isLoggedIn', 'true');  // 将登录状态存储到 localStorage
    },
    logout() {
      this.isLoggedIn = false;  // 退出时设置为未登录
      localStorage.removeItem('isLoggedIn');  // 清除登录状态
    },
    setLoginStatus(status: boolean) {
      this.isLoggedIn = status;  // 设置登录状态
    },
    initialize() {
      const status = localStorage.getItem('isLoggedIn');
      if (status) {
        this.setLoginStatus(true);  // 如果 localStorage 中有登录信息，则设置为已登录
      }
    }
  },
});
