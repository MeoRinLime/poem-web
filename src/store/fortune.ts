import { defineStore } from 'pinia';

export const useFortuneStore = defineStore('fortune', {
  state: () => ({
    lastClickedDate: null as string | null, // 用于存储上次点击的日期，格式为 'YYYY-MM-DD'
  }),
  actions: {
    // 更新点击日期为今天
    updateLastClickedDate() {
      const today = new Date().toISOString().split('T')[0]; // 获取今天的日期字符串 'YYYY-MM-DD'
      this.lastClickedDate = today;
    },
    // 判断今天是否已经点击过
    isClickedToday(): boolean {
      const today = new Date().toISOString().split('T')[0];
      return this.lastClickedDate === today;
    },
  },
});
