<!-- eslint-disable id-length -->
<script lang="ts">
import { ref, computed} from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';

const route = useRoute()

const lineList = ref(
  Array.from({ length: 15 }).map((_, index) => ({
    c1: index === 9 ? '#DA70D6' : Math.random() > 0.5 ? '#69E4F6' : '#FED258',
    c2: index === 9 ? '#FF69B4' : Math.random() > 0.5 ? '#69e4f600' : 'rgba(254,210,88,0)',
    t: `${Math.random() * 100}vh`,
    l: `${Math.random() * 100}vw`,
    d: Math.floor(Math.random() * 6),
    r: Math.random() * 360,
    duration: `${Math.random() * 3 + 2}s`, // 随机时间2-5s
    delay: `${Math.random() * 5}s`, // 随机延迟0-5s
  }))
);

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
})

const backgroundImageUrl = ref<string>('');
const backgroundVisible = ref<boolean>(false); // 默认不显示背景图
const blurAmount = ref<number>(6);



export default defineComponent({
  name: 'App',
  setup() {
    const route = useRoute();
    const isFullScreenPage = computed(() => route.meta.isFullscreen);
    const authStore = useAuthStore();
    onMounted(() => {
      authStore.initialize();
    });
    return { isFullScreenPage };
  },
  data() {
    return {
      lineList,
      backgroundImageUrl,
      backgroundVisible,
      blurAmount,
    };
  },
});

</script>


<template>
  <n-message-provider>
    <div :class="isFullScreenPage ? 'fixed-container' : 'scroll-container'">
      <!-- 导航栏 -->
      <Header class="h-16 bg-white flex-shrink-0"></Header>
      
      <!-- 内容区域 -->
      <div class="relative flex-grow">
        <!-- 背景图 -->
        <div 
          v-if="backgroundVisible" 
          :style="{ 
            backgroundImage: `url(${backgroundImageUrl})`, 
            filter: `blur(${blurAmount}px)` 
          }" 
          class="fixed inset-0 bg-cover bg-center z-0">
        </div>

        <!-- 渐变和网格 -->
        <div 
          class="fixed inset-0 bg-gradient-to-b from-pink-500 via-white to-blue-500 opacity-5 z-0"
        ></div>
        <div 
          class="fixed inset-0 bg-[url(/img/grid.svg)] bg-top z-0"
        ></div>


        <!-- 主内容 -->
        <main class="relative z-10">
          <router-view :key="$route.fullPath"/>
        </main>
      </div>
      
      <!-- 页脚 -->
      <footer class="py-6 text-sm text-center text-gray-700"></footer>

      <!-- 流星效果 -->
      <div class="line-box">
        <span
          class="line-item"
          v-for="(item, index) in lineList"
          :key="index"
          :style="{
            '--c1': item.c1,
            '--c2': item.c2,
            '--t': item.t,
            '--l': item.l,
            '--d': item.d,
            '--r': item.r,
            '--duration': item.duration,
            '--delay': item.delay,
          }"
        ></span>
      </div>
    </div>
  </n-message-provider>
</template>


<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-cover {
  background-size: cover;
}

.line-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none; /* 确保流星不会阻挡其他元素的交互 */
  z-index: 1;
}

.line-item {
  width: 2px;
  height: 80px;
  background: linear-gradient(0deg, var(--c1) 0%, var(--c2) 100%);
  position: absolute;
  top: var(--t);
  left: var(--l);
  transform: rotate(45deg);
  opacity: 0;
  animation: shank var(--duration) linear infinite; /* 使用随机持续时间 */
  animation-delay: var(--delay); /* 使用随机延迟 */
}

.line-item::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c1);
  filter: blur(1.8px);
  box-shadow: 0px -1px -1px 5px var(--c2);
  bottom: -4px;
  left: 50%;
  transform: translate(-50%);
}

@keyframes shank {
  0% {
    transform: rotate(45deg) translateY(-200px) scale(0.5); /* 调整初始位置 */
    opacity: 0;
  }
  70% {
    opacity: 1;
    transform: rotate(45deg) translateY(200px) scale(1.1); /* 调整中间位置 */
  }
  100% {
    transform: rotate(45deg) translateY(400px) scale(0.5); /* 调整结束位置 */
    opacity: 0;
  }
}

.fixed-container {
  height: 100vh;
  overflow: hidden;
}

.scroll-container {
  min-height: 100vh;
  overflow-y: auto;
}
</style>

