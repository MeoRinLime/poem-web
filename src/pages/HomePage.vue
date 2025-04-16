
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
      class="fixed bottom-0 left-0 ml-4 mb-4"
    >

    

    <!-- 主内容 -->
    <div class="flex flex-col justify-center items-center z-10 relative top-40">
      <h1 class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 opacity-90 font-serif" style="font-family: Georgia, 'SimSun', serif">
        诗韵Poemre
      </h1>
      <h2 class="text-2xl mt-4 text-amber-700 opacity-80 font-serif">Welcome to 诗歌世界</h2>

      <!-- 随机一诗 -->
      <div class="items-center fixed bottom-0 right-0 mr-4 mb-4">
        <DailyPoem :quoteData="quoteData"/>
      </div>

      <!-- 按钮区域 -->
      <div class="flex space-x-10 mt-16"> 
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

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import router from '@/router';
import { getPoemRecommend } from '@/api/hitopoem';
import DailyPoem from '@/components/DailyPoem.vue';

const backgroundImageUrl = ref('');
const backgroundOpacity = ref(0);

const quoteData = reactive({
  authorName: '',
  content: '',
  dynasty: '',
});

onMounted(async () => {
  try {
    setTimeout(() => {
      backgroundOpacity.value = 1;
    }, 100);

    const responseHitokoto = await getPoemRecommend();
    console.log('responseHitokoto:', responseHitokoto);
    quoteData.authorName = responseHitokoto.data.authorName;
    quoteData.content = responseHitokoto.data.content;
    quoteData.dynasty = responseHitokoto.data.dynasty;
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
</script>

<style scoped>
/* 其他样式... */

/* GIF动图样式 */
img {
  width: 300px; /* 根据需要调整大小 */
  height: auto;
  filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 5)); /* 添加阴影效果 */
}
</style>