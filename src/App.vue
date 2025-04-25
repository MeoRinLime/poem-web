<template>
  <n-message-provider>
    <div :class="['app-container', isFullScreenPage ? 'fixed-container' : 'scroll-container', { 'dark-mode': isDark }]">
      <!-- 导航栏 - 添加事件监听 -->
      <Header class="flex-shrink-0" @theme-change="handleThemeChange"></Header>

      <!-- 流星效果 -->
      <MeteorsStars class="fixed-container" :class="{ 'dark-stars': isDark }"></MeteorsStars>
      
      <!-- 内容区域 -->
      <div class="relative flex-grow">
        <!-- 背景图片 - 添加动态类 -->
        <div 
          class="fixed inset-0 bg-[url(/img/background.png)] bg-cover bg-center bg-no-repeat z-0 transition-all duration-500"
          :class="isDark ? 'opacity-20 dark-bg' : 'opacity-20'"
        ></div>
        <div 
          v-if="isDark"
          class="fixed inset-0 dark-bg z-10 transition-all duration-500"
        ></div>

        <!-- 主内容 -->
        <main class="relative z-10">
          <router-view :key="$route.fullPath"/>
        </main>
      </div>

      <!-- 页脚 -->
      <footer class="py-6 text-sm text-center transition-colors duration-500"
        :class="isDark ? 'text-gray-400' : 'text-gray-700'">
      </footer>
    </div>
  </n-message-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';

const route = useRoute();
const isDark = ref(false);

// 处理主题变化
const handleThemeChange = (darkMode: boolean) => {
  isDark.value = darkMode;
  // 同时应用到HTML元素上
  document.documentElement.classList.toggle('dark', darkMode);
  // 存储用户选择的主题偏好到 localStorage
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
};

// 检查系统初始主题偏好
const checkSystemTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    handleThemeChange(true);
  } else if (storedTheme === 'light') {
    handleThemeChange(false);
  } else {
    handleThemeChange(prefersDark);
  }
};

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (!localStorage.getItem('theme')) {
    handleThemeChange(e.matches);
  }
};

onMounted(() => {
  checkSystemTheme();
  mediaQuery.addEventListener('change', handleSystemThemeChange);
});

</script>

<style>
/* 暗夜模式背景效果 */
.dark-bg {
  background-color: rgba(13, 13, 12, 0.6);
}

/* 流星暗夜模式效果 */
.dark-stars .meteor {
  opacity: 0.8;
}

/* 全局暗夜模式样式 */
.dark-mode {
  color-scheme: dark;
}
</style>