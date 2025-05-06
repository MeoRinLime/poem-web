<template>
  <div class="container mx-auto pt-24 pb-8">
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
        搜索 "{{ searchQuery }}" 的结果 ({{ totalItems }})
      </h2>

      <div class="space-y-4">
        <div 
          v-for="result in searchResults" 
          :key="result.postId || result.poemId" 
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
              {{ getTypeLabel(result.type) }}
            </span>
          </div>

          <div class="text-gray-600 mb-4 line-clamp-3">
            {{ result.content || result.excerpt }}
          </div>

          <div class="flex justify-between text-sm text-gray-500">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              {{ result.poemAuthor || result.authorName || result.userName }}
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

      <!-- 分页控件 -->
      <div v-if="totalItems > 0" class="flex justify-center mt-8">
        <div class="flex items-center space-x-1">
          <!-- 上一页按钮 -->
          <button 
            class="px-4 py-2 border rounded-md" 
            :class="{'text-gray-400 cursor-not-allowed': currentPage === 1, 'hover:bg-gray-100': currentPage > 1}" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            上一页
          </button>
          
          <!-- 页码按钮 -->
          <div v-for="page in displayedPages" :key="page" class="px-1">
            <button 
              v-if="page !== '...'"
              :class="{'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-100': page !== currentPage}" 
              class="px-4 py-2 border rounded-md"
              @click="changePage(Number(page))"
            >
              {{ page }}
            </button>
            <span v-else class="px-2">...</span>
          </div>
          
          <!-- 下一页按钮 -->
          <button 
            class="px-4 py-2 border rounded-md" 
            :class="{'text-gray-400 cursor-not-allowed': currentPage === totalPages, 'hover:bg-gray-100': currentPage < totalPages}" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '@/api/search'

// 定义搜索结果的接口类型
interface SearchResult {
  poemId?: number
  postId?: number
  title: string
  subTitle?: string
  content?: string
  excerpt?: string
  poemAuthor?: string
  authorName?: string
  userName?: string
  createdAt: string
  type: number
  status?: number
}

const route = useRoute()
const router = useRouter()
const searchQuery = ref(route.query.keyWord as string || '')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(6 // 每页固定6条记录
)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// 计算要显示的页码
const displayedPages = computed(() => {
  const result: (number | string)[] = []
  const maxDisplayed = 5 // 最多显示5个页码

  if (totalPages.value <= maxDisplayed) {
    // 总页数少于或等于最大显示数量，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i)
    }
  } else {
    // 总页数超过最大显示数量
    if (currentPage.value <= 3) {
      // 当前页在前面位置
      for (let i = 1; i <= 4; i++) {
        result.push(i)
      }
      result.push('...')
      result.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      // 当前页在末尾位置
      result.push(1)
      result.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        result.push(i)
      }
    } else {
      // 当前页在中间位置
      result.push(1)
      result.push('...')
      result.push(currentPage.value - 1)
      result.push(currentPage.value)
      result.push(currentPage.value + 1)
      result.push('...')
      result.push(totalPages.value)
    }
  }

  return result
})

// 切换页码
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  performSearch()
}

// 获取类型标签
const getTypeLabel = (type: number): string => {
  switch (type) {
    case 0: return '讨论'
    case 1: return '创作'
    case 2: return '诗歌'
    case 3: return '朗诵'
    default: return '其他'
  }
}

// 执行搜索的函数
const performSearch = async () => {
  if (!searchQuery.value) {
    errorMessage.value = '请输入搜索关键词'
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const response = await search(searchQuery.value, currentPage.value, pageSize.value)
    searchResults.value = response.content
    totalItems.value = response.totalElements
    isLoading.value = false
  } catch (error: any) {
    errorMessage.value = error.message || '搜索失败'
    isLoading.value = false
  }
}

// 跳转到详情页的方法
const navigateToDetail = (result: SearchResult) => {
  // 根据不同的类型跳转到不同的详情页
  switch(result.type) {
    case 0: // post - 讨论
      router.push('/communication/' + result.postId)
      break
    case 1: // poemUser - 创作
      router.push('/user-poem-detail/' + result.poemId)
      break
    case 2: // poemPoet - 诗歌
      router.push('/poet-poem-detail/' + result.poemId)
      break
    case 3: // recitation - 朗诵
      router.push('/recitation/' + result.poemId)
      break
    default:
      // 默认跳转到帖子页面
      if(result.postId) {
        router.push('/communication/' + result.postId)
      } else if(result.poemId) {
        router.push('/user-poem-detail/' + result.poemId)
      }
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