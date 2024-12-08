<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import axios from 'axios';
import Typed from 'typed.js';
import router from '@/router';

export default defineComponent({
  name: 'HomePage',
  setup() {
    // 背景图片 URL
    const backgroundImageUrl = ref('');

    // 背景淡入效果的响应式变量
    const backgroundOpacity = ref(0);

    // 随机古诗
    onMounted(async () => {
      try {
        // 淡入背景
        setTimeout(() => {
          backgroundOpacity.value = 1;
        }, 100);

        const responseHitokoto = await axios.get('https://v1.hitokoto.cn/?c=a&encode=json');
        console.log(responseHitokoto.data);
        new Typed('#hitokoto', {
          strings: [responseHitokoto.data.hitokoto],
          typeSpeed: 50,
          showCursor: false,
        });
        new Typed('#hitokoto-From', {
          strings: [`——  ${responseHitokoto.data.from} `],
          typeSpeed: 50,
          showCursor: false,
          startDelay: 1000,
        });
      } catch (error) {
        console.error('Failed to fetch hitokoto:', error);
      }
    });

    const handleCreatePoem = () => {
      router.push('/write-poem');
    };

    const handleDailyPoem = () => {
      router.push('/daily-poem');
    };

    return {
      backgroundImageUrl,
      backgroundOpacity,
      handleCreatePoem,
      handleDailyPoem
    };
  }
});
</script>

<template>
  <div class="fixed inset-0 overflow-hidden">
    <!-- 背景图片 -->
    <div 
      class="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000 ease-in-out" 
      :style="{ 
        backgroundImage: `url(${backgroundImageUrl})`, 
        opacity: backgroundOpacity 
      }"
    ></div>

    <!-- 主内容 -->
    <div class="flex flex-col justify-center items-center z-10 relative top-40">
      <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-70">
        Welcome to 诗韵Poemre<br/>
      </h1>

      <!-- 一言 -->
      <div class="text-center mt-10">
        <span id="hitokoto" class="text-xl text-gray-700"></span>
        <div id="hitokoto-From" class="text-sm text-gray-500 mt-2"></div>
      </div>

      <!-- 按钮区域 -->
      <div class="flex justify-center space-x-4 mt-10 w-full">
        <button 
          @click="handleCreatePoem" 
          class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          开始创作
        </button>
        <button 
          @click="handleDailyPoem" 
          class="px-6 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          每日一诗
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保留必要的样式 */
</style>