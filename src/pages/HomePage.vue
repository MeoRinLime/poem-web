<script lang="ts">
import { ref, onMounted, defineComponent, type CSSProperties } from 'vue';
import axios from 'axios';
import Typed from 'typed.js';

export default defineComponent({
  name: 'HomePage',
  setup() {
    // 获取背景图片和一言
    onMounted(async () => {
      try {
      } catch (error) {
        console.error('Failed to fetch background image:', error);
      }

      try {
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

    return {};
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center z-10 relative top-40">
    <h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-70">
      Welcome to 诗韵Poemre<br/>
    </h1>

    <!-- 一言 -->
    <div class="text-center mt-10">
      <span id="hitokoto" class="text-xl text-gray-700"></span>
      <div id="hitokoto-From" class="text-sm text-gray-500 mt-2"></div>
    </div>
  </div>
</template>


<style scoped>

</style>
