<script setup lang="ts">
import { StarEmphasis24Filled } from '@vicons/fluent';
import { ref } from 'vue';
import { useFortuneStore } from '@/store/fortune';
const store = useFortuneStore();
const randomImage = ref<string | null>(null);
const alertMessage = ref<string | null>(null);

// 图片列表
const imageList: string[] = [
  'src/assets/daily-fortune/1.png',
  'src/assets/daily-fortune/2.png',
  'src/assets/daily-fortune/3.png',
  'src/assets/daily-fortune/4.png',
  'src/assets/daily-fortune/5.png',
  'src/assets/daily-fortune/6.png',
  'src/assets/daily-fortune/7.png',
  'src/assets/daily-fortune/8.png',
  'src/assets/daily-fortune/9.png',
  'src/assets/daily-fortune/10.png',
];

const loadingGif = 'src/assets/daily-fortune/loading.gif';

// 点击按钮时随机选择一张图片
const showRandomImage = () => {
  if (store.isClickedToday()) {
    alertMessage.value = '今天已经查看过运势了哦~ 人生没有重来的机会，明天再来吧~';
    return;
  }

  randomImage.value = loadingGif;

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    randomImage.value = imageList[randomIndex];
    store.updateLastClickedDate();
    alertMessage.value = null;
  }, 2000);
};
</script>

<template>
  <div class="container mx-auto relative max-w-4xl bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 px-4 py-8 top-16 rounded-xl flex justify-center items-center flex-col">
    <n-alert v-if="alertMessage" closable title="KizunaAi提醒您：" type="error" class="mb-10">
      {{ alertMessage }}
    </n-alert>
    <n-button ghost color="#EE4F87" @click="showRandomImage">
      <template #icon>
        <n-icon>
          <StarEmphasis24Filled />
        </n-icon>
      </template>
      查询今日运势
    </n-button>

    <!-- 运势图片显示区域 -->
    <div v-if="randomImage" class="mt-10">
      <img :src="randomImage" alt="今日运势图片" class="w-180 h-80 object-cover rounded-lg shadow-md">
    </div>
  </div>
</template>

<style scoped>

</style>