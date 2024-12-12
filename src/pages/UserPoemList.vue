<script setup lang="ts">
import { ref, computed, onMounted} from 'vue'
import { 
  NCard, 
  NGrid, 
  NGridItem, 
  NTag, 
  NPagination,
  NButton,
  NIcon,
  NDivider
} from 'naive-ui'
import { 
  PersonOutline, 
  CalendarOutline,
  AddOutline
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { getAllUserPoems } from '@/api/poemUser'

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

const router = useRouter()

const poems = ref<Poem[]>([])
onMounted(() => {
  getAllUserPoems().then((response: { data: any }) => {
    const data = response.data
    poems.value = data
  })
})

// 跳转到详情页
const goToDetail = (poemId: number) => {
  router.push({ name: 'UserPoemDetail', params: { poemId } })
}

// 跳转到新建诗歌页面
const goToNewPoem = () => {
  router.push({ name: 'WritePoem' })
}

// 分页相关
const currentPage = ref(1)
const pageSize = 6

const pageCount = computed(() => Math.ceil(poems.value.length / pageSize))

const paginatedPoems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return poems.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <!-- 页面标题和添加按钮 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">
          诗歌长廊
        </h1>
        <n-button 
          type="primary" 
          size="large" 
          @click="goToNewPoem"
        >
          <template #icon>
            <n-icon :component="AddOutline" />
          </template>
          撰写新诗
        </n-button>
      </div>

      <!-- 诗歌列表 -->
      <n-grid :cols="3" :x-gap="24" :y-gap="24">
        <n-grid-item 
          v-for="poem in paginatedPoems" 
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

      <!-- 分页组件 -->
      <div class="mt-8 flex justify-center">
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

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.transition-transform {
  transition: transform 0.3s ease;
}
</style>