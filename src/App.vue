<template>
  <n-message-provider>
    <!-- 添加 dark 类绑定 -->
    <div :class="['theme-container', isDarkMode ? 'dark' : '', isFullScreenPage ? 'fixed-container' : 'scroll-container']">
      <!-- 导航栏 -->
      <Header class="flex-shrink-0" :dark-mode="isDarkMode" />
      
      <!-- 流星效果 -->
      <MeteorsStars class="fixed-container" :dark-mode="isDarkMode" />
      
      <!-- 内容区域 -->
      <div class="relative flex-grow">
        <!-- 背景图片 - 添加暗黑模式滤镜 -->
        <div 
          class="fixed inset-0 bg-[url(/img/background.png)] bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-300"
          :class="isDarkMode ? 'opacity-10 brightness-75' : 'opacity-20'"
        ></div>

        <!-- 主内容 -->
        <main class="relative z-10 text-gray-800 dark:text-gray-200 bg-white/50 dark:bg-gray-900/80">
          <router-view :key="$route.fullPath"/>
        </main>
      </div>

      <!-- 页脚 - 添加暗色样式 -->
      <footer class="py-6 text-sm text-center text-gray-700 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80">
        &copy; {{ new Date().getFullYear() }} Meorin
      </footer>
    </div>
  </n-message-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';

const route = useRoute();

// 暗黑模式状态
const isDarkMode = ref(false);

// 初始化暗黑模式
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedMode === 'dark' || (!savedMode && systemPrefersDark)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
};

// 切换暗黑模式
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'light');
  }
};

useHead({
  title: () => route.meta.title || 'Meorin',
  meta: [
    {
      property: 'og:title',
      content: () => route.meta.title,
    },
    {
      name: 'twitter:title',
      content: () => route.meta.title,
    },
  ],
});

const isFullScreenPage = computed(() => route.meta.isFullscreen);
const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize();
  initializeDarkMode();
});
</script>

