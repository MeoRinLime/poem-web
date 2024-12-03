<template>
  <div class="container mx-auto relative max-w-4xl bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 px-4 py-8 top-16 rounded-xl">
    <h1 class="text-3xl font-bold mb-6">Meorin的旅行日记</h1>
    <n-card
      v-for="entry in journalEntries"
      :key="entry.title"
      class="mb-4 cursor-pointer hover:bg-gray-100 transition"
      @click="navigateToEntry(entry.title)"
    >
      <div class="flex items-center">
        <div class="flex-shrink-0 mr-4">
          <img :src="`${entry.image}`" alt="entry.title" class="w-20 h-20 object-cover rounded"/>
        </div>
        <div>
          <h2 class="text-xl font-semibold">{{ entry.title }}</h2>
          <p class="text-gray-800 mt-2">{{ entry.summary }}</p>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'TravelJournal',
  setup() {
    const router = useRouter();
    const journalEntries = ref<any[]>([]);

    const fetchJournalEntries = async () => {
      try {
        const response = await axios.get('http://47.120.46.215:3000/api/markdown');

        // 确保返回的数据是数组
        if (Array.isArray(response.data)) {
          const entries = response.data.map((entry: { title: string; image: string }) => ({
            title: entry.title,
            summary: '', // 初始 summary 为空，后面获取内容
            image: entry.image ? entry.image.replace('/', 'http://47.120.46.215:3000/') : 'http://47.120.46.215:3000/images/cutcamera.png', // 使用从后端获取的图片路径，如果为空则使用默认图片
          }));

          for (const entry of entries) {
            const contentResponse = await axios.get(`http://47.120.46.215:3000/api/markdown/${entry.title}`);
            // 使用正则表达式去除HTML标签
            const textContent = contentResponse.data.replace(/<\/?[^>]+(>|$)/g, "");
            // 取前40个字符作为摘要
            entry.summary = textContent.slice(0, 40) + '...';
          }

          journalEntries.value = entries;
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch journal entries:', error);
      }
    };

    const navigateToEntry = (title: string) => {
      router.push({ path: `/travel-diary/${encodeURIComponent(title)}` });
    };

    onMounted(() => {
      fetchJournalEntries();
    });

    return {
      journalEntries,
      navigateToEntry,
    };
  },
});
</script>

<style scoped>

</style>
