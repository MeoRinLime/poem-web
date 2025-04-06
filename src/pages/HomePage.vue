<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import Typed from 'typed.js';
import router from '@/router';
import { getPoemRecommend } from '@/api/hitopoem';

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

    const isBookOpen = ref(false); // 新增书本状态
    
    const toggleBook = () => {
      isBookOpen.value = !isBookOpen.value;
    };

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
      isBookOpen,  // 暴露状态
      toggleBook   // 暴露方法
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
      <h1 class="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-70 font-serif" style="font-family: Georgia, 'SimSun', serif">
       Welcome to 诗韵Poemre<br/>
</h1>

       <!-- 随机一诗 - 添加了边框样式 -->
       <div class="text-center mt-20 p-6 border-2 border-gray-300 rounded-lg bg-white bg-opacity-70 shadow-md max-w-md mx-auto font-mono translate-x-[50%]">
       <span id="hitokoto" class="text-xl text-gray-800" style="font-family: 'Courier New', Courier, monospace"></span>
      <div id="hitokoto-From" class="text-sm text-gray-600 mt-2 italic" style="font-family: 'Courier New', Courier, monospace"></div>
</div>
      <!-- 按钮区域 -->
      <div class="flex space-x-10 mt-16 translate-x-[50%]"> 
        <button 
          @click="handleCreatePoem" 
          class="px-8 py-3 text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity font-serif" 
        >
          开始创作
        </button>
        <button 
          @click="handleDailyPoem" 
          class="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:opacity-90 transition-opacity font-serif" 
        >
          每日一诗
        </button>
      </div>
    </div>
  </div>

  <!-- 翻页书组件 -->
  <div 
      class="flipping-book" 
      @click="toggleBook"
      :class="{ 'book-opened': isBookOpen }"
    >
      <div class="book">
        <div class="front-cover"></div>
        <div class="pages">
          <div class="page"></div>
          <div class="page"></div>
          <div class="page"></div>
        </div>
        <div class="back-cover"></div>
      </div>
    </div>

</template>


<style scoped>
/* 书本容器 */
.flipping-book {
  position: fixed;
  left: 25%;
  bottom: 25%;
  z-index: 100;
  transform: scale(1.6);
  transform-origin: left bottom;
  cursor: pointer;
  transition: transform 0.3s ease;
}

/* 书本基础样式 */
.book {
  width: 120px;
  height: 160px;
  position: relative;
  perspective: 1000px;
}

/* 封面样式 */
.front-cover,
.back-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #8e44ad 0%, #3498db 100%);
  border-radius: 2px 8px 8px 2px;
  box-shadow: -3px 3px 10px rgba(0,0,0,0.2);
  transform-origin: left center; /* 修正：使用标准语法 */
}

.front-cover {
  z-index: 100;
  transform: rotateY(-20deg);
  transition: transform 1s ease;
}

.back-cover {
  z-index: 5;
  transform: rotateY(-10deg) translateZ(-10px);
}

/* 书页样式 */
.pages {
  position: absolute;
  width: 96%;
  height: 96%;
  top: 2%;
  left: 2%;
  z-index: 20;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 0 5px 5px 0;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
  transform-origin: left center; /* 修正：使用标准语法 */
}

/* 翻页动画 */
@keyframes flipPage {
  0%, 30% { transform: rotateY(0); }
  40%, 60% { transform: rotateY(-160deg); }
  70%, 100% { transform: rotateY(0); }
}

.page:nth-child(1) {
  animation: flipPage 5s infinite 0.5s;
}


.flipping-book:hover {
  transform: scale(1.65);
}

/* 书本打开状态 */
.book-opened .front-cover {
  transform: rotateY(-160deg) !important;
}

.book-opened .page:nth-child(1) {
  transform: rotateY(-50deg);
}


/* 优化动画流畅度 */
.front-cover, .page {
  transition: transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
}

</style>