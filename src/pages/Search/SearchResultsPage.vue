<template>
  <div class="container mx-auto pt-24">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
      <span class="ml-3 text-gray-600">搜索中...</span>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="errorMessage" class="text-center text-red-500 py-8">
      {{ errorMessage }}
    </div>

    <!-- 无搜索结果 -->
    <div v-else-if="searchResults.length === 0" class="text-center py-8">
      <div class="text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        没有找到相关内容
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-else>
      <h2 class="text-2xl font-bold mb-6 text-gray-700">
        搜索 "{{ searchQuery }}" 的结果 ({{ searchResults.length }})
      </h2>

      <div class="space-y-4">
        <div 
          v-for="result in searchResults" 
          :key="result.poemId" 
          class="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          @click="navigateToDetail(result)"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">{{ result.title }}</h3>
              <p v-if="result.subTitle" class="text-gray-500 text-sm">
                {{ result.subTitle }}
              </p>
            </div>
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium 
              text-blue-800 bg-blue-100"
            >
              {{ result.type === 1 ? '诗歌' : '其他' }}
            </span>
          </div>

          <div class="text-gray-600 mb-4 line-clamp-3">
            {{ result.content }}
          </div>

          <div class="flex justify-between text-sm text-gray-500">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              {{ result.poemAuthor || result.userName }}
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              {{ result.createdAt }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '@/api/search'

// 定义搜索结果的接口类型
interface SearchResult {
  poemId?: number
  title: string
  subTitle?: string
  content: string
  poemAuthor: string
  userName: string
  createdAt: string
  type?: number
  postId?: number 
}

const route = useRoute()
const router = useRouter()
const searchQuery = ref(route.query.keyWord as string || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// 执行搜索的函数
const performSearch = async () => {
  if (!searchQuery.value) {
    errorMessage.value = '请输入搜索关键词'
    isLoading.value = false
    return
  }

  try {
    const data = await search(searchQuery.value)
    searchResults.value = data
    isLoading.value = false
  } catch (error: any) {
    errorMessage.value = error.message || '搜索失败'
    isLoading.value = false
  }
}

// 跳转到详情页的方法
const navigateToDetail = (result: SearchResult) => {
  // 根据不同的类型跳转到不同的详情页
  if (result.type === 1) {  //解释帖子
    router.push('/poem-explanation/' + result.postId)
  } else if (result.poemId) {  
    router.push('/user-poem-detail/' + result.poemId)
  }
}

// 在组件挂载时执行搜索
onMounted(performSearch)
</script>


<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>