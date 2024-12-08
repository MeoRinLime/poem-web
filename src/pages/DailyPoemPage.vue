<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NCard, NImage, NDivider, NSpace, NTag, NPagination, NEmpty } from 'naive-ui'

// Interface for poem data structure
interface Poem {
  id: number
  title: string
  author: string
  content: string
  dynasty: string
  relatedPosts?: RelatedPost[]
}

// Interface for related posts
interface RelatedPost {
  id: number
  title: string
  author: string
  excerpt: string
  commentCount: number
  likeCount: number
}

// Mock data - in a real application, this would come from an API
const dailyPoem = ref<Poem>({
  id: 1,
  title: '静夜思',
  author: '李白',
  content: `\n床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。`,
  dynasty: '唐',
  relatedPosts: [
    {
      id: 101,
      title: '细品李白《静夜思》的深意',
      author: '诗词爱好者',
      excerpt: '李白这首诗道出了游子思乡的深切情感...',
      commentCount: 42,
      likeCount: 256
    },
    {
      id: 102,
      title: '月光下的乡愁',
      author: '文学评论家',
      excerpt: '从诗中感受古人对家乡的眷恋...',
      commentCount: 28,
      likeCount: 189
    }
  ]
})

// Reactive state for current post page
const currentPostPage = ref(1)
const postsPerPage = 5

// Computed property for paginated posts
const paginatedPosts = computed(() => {
  if (!dailyPoem.value.relatedPosts) return []
  const start = (currentPostPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return dailyPoem.value.relatedPosts.slice(start, end)
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="w-full max-w-3xl shadow-lg rounded-lg"
      :content-style="{ padding: '24px' }"
    >
      <!-- Poem Title and Author Section -->
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          {{ dailyPoem.title }}
        </h1>
        <div class="text-gray-600 text-xl">
          {{ dailyPoem.dynasty }} · {{ dailyPoem.author }}
        </div>
      </div>

      <!-- Poem Content -->
      <div class="bg-white p-6 rounded-lg shadow-inner mb-6">
        <pre class="whitespace-pre-wrap text-center text-xl text-gray-700">
          {{ dailyPoem.content }}</pre>
      </div>

      <!-- Related Posts Section -->
      <n-divider title-placement="left">
        <span class="text-gray-600">相关讨论</span>
      </n-divider>

      <!-- Posts List -->
      <div v-if="dailyPoem.relatedPosts?.length">
        <div 
          v-for="post in paginatedPosts" 
          :key="post.id" 
          class="mb-4 p-4 border-b last:border-b-0 hover:bg-gray-100 transition-colors"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold text-gray-800">{{ post.title }}</h3>
            <div class="flex space-x-2">
              <n-tag type="info" size="small">
                {{ post.commentCount }} 评论
              </n-tag>
              <n-tag type="success" size="small">
                {{ post.likeCount }} 点赞
              </n-tag>
            </div>
          </div>
          <p class="text-gray-600 mb-2">{{ post.excerpt }}</p>
          <div class="text-right text-gray-500 text-sm">
            作者：{{ post.author }}
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center">
          <n-pagination 
            v-model:page="currentPostPage"
            :page-count="Math.ceil((dailyPoem.relatedPosts?.length || 0) / postsPerPage)"
          />
        </div>
      </div>

      <!-- Empty State -->
      <n-empty 
        v-else 
        description="暂无相关讨论" 
        class="my-6" 
      />
    </n-card>
  </div>
</template>

<style scoped>
pre {
  font-family: 'Ma Shan Zheng', cursive; /* 使用更具诗意的字体 */
  line-height: 1.8;
}
</style>