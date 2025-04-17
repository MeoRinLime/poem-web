<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
      :content-style="{ padding: '16px' }"
    >
      <!-- 页面标题和添加按钮 -->
      <div class="flex justify-between items-center mb-8">
        <BigTitle text="诗歌长廊" />
        <CreateButton 
          @click="goToNewPoem"
        >
          新建诗歌
        </CreateButton>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <LoadingComponent />
      </div>

      <!-- 诗歌列表 -->
      <n-grid v-else-if="poems.length > 0" :cols="isMobile ? 1 : 3" :x-gap="24" :y-gap="24">
        <n-grid-item 
          v-for="poem in poems" 
          :key="poem.poemId"
          class="cursor-pointer hover:scale-105 transition-transform"
          @click="goToDetail(poem.poemId)"
        >
          <n-card 
            :title="poem.title"
            class="h-full"
            hoverable
          >
            <!-- 优化标题和副标题显示 -->
            <template v-if="poem.subtitle" #header-extra>
              <n-tag size="small" type="info">
                {{ poem.subtitle }}
              </n-tag>
            </template>

            <div class="mb-4 text-gray-600">
              {{ poem.content.length > 100 ? poem.content.slice(0, 100) + '...' : poem.content }}
            </div>

            <n-divider class="my-4" />

            <div class="flex justify-between items-center text-sm text-gray-500">
              <div class="flex items-center space-x-1">
                <n-icon :component="PersonOutline" class="w-4 h-4" />
                <span>{{ poem.authorName }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <n-icon :component="CalendarOutline" class="w-4 h-4" />
                <span>{{ poem.createdAt }}</span>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <div v-else class="text-center py-12 text-gray-500">
        暂无诗歌数据
      </div>

      <!-- 分页组件 -->
      <div v-if="pageCount > 1" class="mt-8 flex justify-center">
        <n-pagination 
          v-model:page="currentPage"
          :page-count="pageCount"
          :page-size="pageSize"
          @update:page="handlePageChange"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NTag,
  NPagination,
  NIcon,
  NDivider
} from 'naive-ui'
import {
  PersonOutline,
  CalendarOutline
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { getPagedUserPoems } from '@/api/poemUser'
import CreateButton from '@/components/CreateButton.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

// 定义诗歌类型
interface Poem {
  poemId: number
  authorName: string
  title: string
  subtitle?: string
  content: string
  createdAt: string
  commentCount: number
  likeCount: number
}

interface PaginationResult {
  items: Poem[]
  total: number
}

const router = useRouter()

const poems = ref<Poem[]>([])
const isMobile = ref(false)
const total = ref(0)
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = 6

// 计算总页数
const pageCount = computed(() => Math.ceil(total.value / pageSize))

const fetchPoems = async (page: number) => {
  loading.value = true
  try {
    const response = await getPagedUserPoems(page, pageSize)
    const data = response.data as PaginationResult
    poems.value = data.content
    //console.log('获取诗歌列表:', poems.value)
    total.value = data.totalElements
  } catch (error) {
    console.error('获取诗歌列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchPoems(page)
}

// 跳转到详情页
const goToDetail = (poemId: number) => {
  router.push({ name: 'UserPoemDetail', params: { poemId } })
}

// 跳转到新建诗歌页面
const goToNewPoem = () => {
  router.push({ name: 'WritePoem' })
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

isMobile.value = window.innerWidth < 768

onMounted(() => {
  fetchPoems(1)
})

</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.max-w-6xl {
  max-width: 1140px;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transition-transform {
  transition: transform 0.3s ease;
}

@media (max-width: 767px) {
  .p-4 {
    padding: 16px;
  }
  .text-4xl {
    font-size: 18px;
  }
  .text-xl {
    font-size: 16px;
  }
  .text-lg {
    font-size: 14px;
  }
  .text-sm {
    font-size: 12px;
  }
  .text-xs {
    font-size: 10px;
  }
}
</style>

