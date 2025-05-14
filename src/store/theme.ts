import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && 
            window.matchMedia('(prefers-color-scheme: dark)').matches)
  }),
  
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.updateTheme()
    },
    
    updateTheme() {
      // 更新 localStorage
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      
      // 更新 HTML 根元素的 class
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    
    initTheme() {
      this.updateTheme()
    }
  }
})