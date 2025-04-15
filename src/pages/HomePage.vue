<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import Typed from 'typed.js';
import router from '@/router';
import { getPoemRecommend } from '@/api/hitopoem';

export default defineComponent({
  name: 'HomePage',
  setup() {
    const backgroundImageUrl = ref('');
    const backgroundOpacity = ref(0);

    onMounted(async () => {
      try {
        setTimeout(() => {
          backgroundOpacity.value = 1;
        }, 100);

        const responseHitokoto = await getPoemRecommend();
        console.log('responseHitokoto:', responseHitokoto);
        new Typed('#hitokoto', {
          strings: [responseHitokoto.data.content],
          typeSpeed: 50,
          showCursor: false,
        });
        new Typed('#hitokoto-From', {
          strings: [`——  ${responseHitokoto.data.authorName} ${responseHitokoto.data.dynasty}`],
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
      handleDailyPoem,
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

    <!-- GIF动图 -->
    <img 
      src="/img/book.gif" 
      alt="Animated GIF" 
      class="absolute top-1/2 left-0 transform  -translate-y-1/2 translate-x-80 translate-y-3"
    >

    

    <!-- 主内容 -->
    <div class="flex flex-col justify-center items-center z-10 relative top-40">
      <h1 class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 opacity-90 font-serif" style="font-family: Georgia, 'SimSun', serif">
        诗韵Poemre
      </h1>
      <h2 class="text-2xl mt-4 text-amber-700 opacity-80 font-serif">Welcome to 诗歌世界</h2>

      <!-- 随机一诗 -->
      <div class="text-center mt-20 p-6 border-2 border-amber-200 rounded-lg bg-amber-50 bg-opacity-70 shadow-md max-w-md mx-auto font-mono translate-x-[50%]">
        <span id="hitokoto" class="text-xl text-amber-900" style="font-family: 'Courier New', Courier, monospace"></span>
        <div id="hitokoto-From" class="text-sm text-amber-800 mt-2 italic" style="font-family: 'Courier New', Courier, monospace"></div>
      </div>

      <!-- 按钮区域 -->
      <div class="flex space-x-10 mt-16 translate-x-[50%]"> 
        <button 
          @click="handleCreatePoem" 
          class="px-8 py-3 text-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:opacity-90 transition-opacity font-serif shadow-md" 
        >
          开始创作
        </button>
        <button 
          @click="handleDailyPoem" 
          class="px-8 py-3 text-lg bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:opacity-90 transition-opacity font-serif shadow-md" 
        >
          每日一诗
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 其他样式... */

/* GIF动图样式 */
img {
  width: 300px; /* 根据需要调整大小 */
  height: auto;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 5)); /* 添加阴影效果 */
}
</style>