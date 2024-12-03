<template>
  <div class="container mx-auto relative max-w-3xl bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 px-4 py-8 top-16 rounded-xl">
    <h1 class="text-3xl font-bold mb-6">{{ postTitle }}</h1>
    <div v-html="postContent" class="prose"></div>
  </div>
</template>
  
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';

  export default defineComponent({
    name: 'BlogPostPage',
    setup() {
      const route = useRoute();
      const postTitle = ref(route.params.title);  // 获取路由参数中的title
      const postContent = ref('');

      onMounted(async () => {
        try {
          const response = await axios.get(`http://47.120.46.215:3000/api/markdown/${postTitle.value}`);
          postContent.value = response.data;
          document.title = `${postTitle.value}`;  // 动态设置页面标题
        } catch (error) {
          console.error('Failed to load blog post:', error);
        }
      });

      return {
        postTitle,
        postContent,
      };
    },
  });
  </script>
  
  <style scoped>
  .blog-content {
    line-height: 1.6;
    font-size: 16px;
    padding: 20px;
  }
  </style>
  