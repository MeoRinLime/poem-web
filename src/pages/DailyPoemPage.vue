<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 mt-12">
    <n-card 
      class="w-full max-w-md shadow-lg rounded-lg"
      :content-style="{ padding: '16px' }"
    >
      <!-- 加载状态 -->
      <template v-if="isLoading">
        <n-empty description="加载中..." class="my-6" />
      </template>
      
      <!-- 错误状态 -->
      <template v-else-if="error">
        <div class="text-red-500 text-center my-6">{{ error }}</div>
      </template>
      
      <!-- 数据展示 -->
      <template v-else>
        <!-- 诗词标题和作者 -->
        <div class="text-center mb-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2" style="font-family: Georgia, serif;">
            {{ dailyPoem?.title }}
          </h1>
          <div class="text-gray-600 dark:text-gray-200 text-base" style="font-family: Georgia, serif;">
            {{ dailyPoem?.dynasty }} · {{ dailyPoem?.author }}
          </div>
        </div>

        <!-- 诗词内容 -->
        <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner mb-4">
          <pre class="whitespace-pre-wrap text-center text-base text-gray-700 dark:text-gray-200" style="font-family: Georgia, serif;">
            {{ dailyPoem?.content }}
          </pre>
        </div>

        <!-- 相关讨论分隔线 -->
        <n-divider title-placement="left">
          <span class="text-gray-600 dark:text-gray-200">相关讨论</span>
        </n-divider>

        <!-- 相关讨论列表 -->
        <div v-if="dailyPoem?.relatedPosts?.length">
          <div 
            v-for="post in paginatedPosts" 
            :key="post.id" 
            class="mb-4 p-2 border-b last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-2xl"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200" style="font-family: Georgia, serif;">{{ post.title }}</h3>
              <div class="flex space-x-2">
                <n-tag type="info" size="small">
                  {{ post.commentCount }} 评论
                </n-tag>
                <n-tag type="success" size="small">
                  {{ post.likeCount }} 点赞
                </n-tag>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-200 mb-2" style="font-family: Georgia, serif;">{{ post.excerpt }}</p>
            <div class="text-right text-gray-500 dark:text-gray-200 text-sm" style="font-family: Georgia, serif;">
              作者：{{ post.author }}
            </div>
          </div>

          <!-- 分页组件 -->
          <div class="mt-4 flex justify-center">
            <n-pagination 
              v-model:page="currentPostPage"
              :page-count="pageCount"
              :show-size-picker="false"
            />
          </div>
        </div>

        <!-- 无相关讨论时的空状态 -->
        <n-empty 
          v-else 
          description="暂无相关讨论" 
          class="my-6" 
        />
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  NCard, 
  NDivider, 
  NTag, 
  NPagination, 
  NEmpty 
} from 'naive-ui'
import { getDailyPoem, getRelatedPoem } from '@/api/recommendPoem'
import type { Poem } from '@/types/poem'

// 定义接口以增强类型安全
interface DailyPoem extends Poem {
  relatedPosts?: RelatedPost[]
}

interface RelatedPost {
  id: number
  title: string
  author: string
  excerpt: string
  commentCount: number
  likeCount: number
}

interface PoemAPI {
  poemId: number
  title: string
  authorName: string
  content: string
  dynasty: string
}

interface RelatedPostAPI {
  postid: number
  title: string
  userName: string
  excerpt: string
  commentCount: number
  likeCount: number
}

// 响应式状态
const dailyPoem = ref<DailyPoem | null>(null)
const isLoading = ref<boolean>(true)
const error = ref<string | null>(null)

// 分页相关
const currentPostPage = ref<number>(1)
const postsPerPage = 5

const paginatedPosts = computed<RelatedPost[]>(() => {
  if (!dailyPoem.value || !dailyPoem.value.relatedPosts) return []
  const start = (currentPostPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return dailyPoem.value.relatedPosts.slice(start, end)
})

const pageCount = computed<number>(() => {
  return Math.ceil((dailyPoem.value?.relatedPosts?.length || 0) / postsPerPage)
})

// 获取每日诗词及相关帖子
const fetchDailyPoem = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [poemResponse, relatedResponse] = await Promise.all([
      getDailyPoem(),
      getRelatedPoem()
    ])

    const poemData: PoemAPI = poemResponse.data
    dailyPoem.value = {
      id: poemData.poemId,
      title: poemData.title,
      author: poemData.authorName,
      content: poemData.content,
      dynasty: poemData.dynasty,
    }

    const relatedData: RelatedPostAPI[] = relatedResponse.data
    dailyPoem.value.relatedPosts = relatedData.map(post => ({
      id: post.postid,
      title: post.title,
      author: post.userName,
      excerpt: post.excerpt,
      commentCount: post.commentCount,
      likeCount: post.likeCount,
    }))
  } catch (err) {
    console.error('Failed to fetch daily poem or related posts:', err)
    error.value = '获取数据失败，请稍后重试。'
  } finally {
    isLoading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchDailyPoem()
})
</script>

<style scoped>
/* 使用 CSS 变量定义字体 */
:root {
  --poem-font: 'Georgia', serif;
}

pre {
  font-family: var(--poem-font);
  line-height: 1.6;
}
</style>
