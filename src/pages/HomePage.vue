<template>
  <div class="fixed inset-0 overflow-auto">
    <!-- 背景图片 -->
    <div 
      class="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-1000 ease-in-out" 
      :style="{ 
        backgroundImage: `url(${backgroundImageUrl})`, 
        opacity: backgroundOpacity 
      }"
    ></div>

    <!-- 主布局容器 -->
    <div class="absolute inset-0 flex flex-col md:flex-row items-center justify-center pt-10 md:pt-0 z-10">
      <!-- 左侧书籍GIF（桌面端显示） -->
      <div class="hidden md:flex items-center justify-center mr-10 lg:mr-20 xl:mr-30 relative">
        <img 
          src="/img/book.gif" 
          alt="Animated Book" 
          class="w-[280px] h-auto z-10 opacity-95 transition-all duration-300 dark:brightness-90"
          style="filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.4));"
        >
      </div>

      <!-- 主内容区域 -->
      <div class="flex flex-col items-center px-4 md:px-0">
        <h1
          class="md:text-7xl text-4xl font-bold text-transparent bg-clip-text 
          bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 opacity-90 font-serif
          dark:from-amber-400 dark:via-amber-500 dark:to-amber-600" 
          style="font-family: Georgia, 'SimSun', serif">
          诗韵Poemre
        </h1>
        <h2 class="md:text-2xl text-lg mt-4 text-amber-700 opacity-80 font-serif dark:text-amber-300">古韵今风，诗意共享</h2>

        <!-- 随机一诗 -->
        <div
          class="text-center md:mt-20 mt-10 p-4 md:p-6 border-2 border-amber-200 rounded-lg 
                  bg-amber-50 bg-opacity-70 shadow-md max-w-md mx-auto font-mono w-[90%] relative z-30
                  dark:bg-gray-800 dark:bg-opacity-80 dark:border-amber-700">
          <span
            id="hitokoto" class="md:text-xl text-base text-amber-900 dark:text-amber-100" 
            style="font-family: 'Courier New', Courier, monospace"></span>
          <div
            id="hitokoto-From" class="text-sm text-amber-800 mt-2 italic dark:text-amber-300" 
            style="font-family: 'Courier New', Courier, monospace"></div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex md:space-x-10 space-x-4 md:mt-16 mt-10 z-30 mb-10 md:mb-0">
          <button 
            class="px-6 py-2 md:px-8 md:py-3 text-base md:text-lg bg-gradient-to-r 
                  from-amber-600 to-amber-700 text-white rounded-lg hover:opacity-90 
                  transition-opacity font-serif shadow-md active:scale-95
                  dark:from-amber-500 dark:to-amber-600" 
            @click="handleCreatePoem" 
          >
            开始创作
          </button>
          <button 
            class="px-6 py-2 md:px-8 md:py-3 text-base md:text-lg bg-gradient-to-r 
                  from-amber-700 to-amber-800 text-white rounded-lg hover:opacity-90 
                  transition-opacity font-serif shadow-md active:scale-95
                  dark:from-amber-600 dark:to-amber-700" 
            @click="handleDailyPoem" 
          >
            每日一诗
          </button>
        </div>
      </div>

      <!-- 移动端书籍GIF（放在底部） -->
      <div class="md:hidden flex justify-center mt-6 mb-10 z-10">
        <img 
          src="/img/book.gif" 
          alt="Animated Book" 
          class="w-[150px] h-auto opacity-90 dark:brightness-70"
          style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));"
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Typed from 'typed.js';
import router from '@/router';
import { getPoemRecommend } from '@/api/hitopoem';

const backgroundImageUrl = ref('');
const backgroundOpacity = ref(0);

const handleResize = () => {
  if (window.innerWidth < 768) {
    backgroundImageUrl.value = '/img/mobile-bg.jpg';
  } else {
    backgroundImageUrl.value = '/img/desktop-bg.jpg';
  }
};

onMounted(async () => {
  try {
    handleResize();
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      backgroundOpacity.value = 1;
    }, 100);

    const responseHitokoto = await getPoemRecommend();
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
    new Typed('#hitokoto', {
      strings: ["目前并没有部署后端，但是您仍然可以体验网站的基本样式"],
      typeSpeed: 50,
      showCursor: false,
    });
    console.error('Failed to fetch hitokoto:', error);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleCreatePoem = () => {
  router.push('/write-poem');
};

const handleDailyPoem = () => {
  router.push('/daily-poem');
};
</script>

<style scoped>
/* 基础字体大小 */
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* 按钮点击效果 */
button {
  transition: transform 0.1s ease, opacity 0.3s ease;
  min-width: 120px;
  min-height: 48px;
}

/* 确保内容不会超出屏幕 */
.fixed {
  -webkit-overflow-scrolling: touch;
}

/* 背景图片优化 */
.absolute {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }

  /* 移动端书籍动图动画 */
  .md\\:hidden img {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
}

/* 书籍GIF悬停效果（桌面端） */
@media (min-width: 768px) {
  img:hover {
    transform: scale(1.03) rotate(-2deg);
    opacity: 1;
  }
}
</style>
