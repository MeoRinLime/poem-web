<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12
      bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
      :content-style="{ padding: '16px' }"
    >
      <!-- 页面标题和添加按钮 -->
      <div class="flex justify-between items-center mb-8">
        <BigTitle :text="title" />
        <CreateButton 
          v-if="showCreateButton"
          @click="onCreateClick"
        >
          {{ createButtonText }}
        </CreateButton>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <LoadingComponent />
      </div>

      <!-- 内容为空时的提示 -->
      <div v-else-if="poemList.content?.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
        {{ emptyText }}
      </div>

      <!-- 诗歌列表 - 使用PoemCard组件展示 -->
      <n-grid v-else :cols="isMobile ? 1 : 3" :x-gap="24" :y-gap="24">
        <n-grid-item 
          v-for="poem in poemList.content" 
          :key="poem.poemId"
          class="flex justify-center cursor-pointer"
          @click="onPoemClick(poem)"
        >
          <PoemCard 
            :title="poem.title"
            :author="poem.authorName"
            :dynasty="poem.dynasty || ''"
            :content="poem.content"
            :max-length="120"
          />
        </n-grid-item>
      </n-grid>

      <!-- 分页组件 -->
      <div v-if="poemList.totalElements > 0" class="pagination-container">
        <n-pagination
          v-model:page="currentPage"
          class="dark:bg-gray-900 dark:text-gray-200"
          :page-count="totalPages"
          :page-size="localPageSize"
          :show-size-picker="!isMobile"
          :page-sizes="[9, 18, 36]"
          show-quick-jumper
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        >
          <template #goto>
            跳至
          </template>
        </n-pagination>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { NCard, NGrid, NGridItem, NPagination } from 'naive-ui'
import { useRouter } from 'vue-router'
import { getPagedPoetPoems } from '@/api/poemPoet'
import type { Poem } from '@/types/poem'

// 接口类型
interface PaginatedResponse {
  content: Poem[];
  totalElements: number;
}

// 定义组件属性
const props = defineProps({
  // 页面标题
  title: {
    type: String,
    default: '诗人作品'
  },
  // 是否显示创建按钮
  showCreateButton: {
    type: Boolean,
    default: false
  },
  // 创建按钮文本
  createButtonText: {
    type: String,
    default: '新建'
  },
  // 每页显示数量
  pageSize: {
    type: Number,
    default: 9
  },
  // 空数据提示文本
  emptyText: {
    type: String,
    default: '暂无诗歌'
  },
  // 诗人ID，如果提供则只显示该诗人的作品
  poetId: {
    type: [String, Number],
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['create', 'poem-click', 'page-change'])

// 响应式状态
const router = useRouter()
const currentPage = ref(1)
const loading = ref(true)
const poemList = ref<PaginatedResponse>({
  content: [],
  totalElements: 0
})
const isMobile = ref(false)
const localPageSize = ref(props.pageSize)

// 计算总页数
const totalPages = computed(() => Math.ceil(poemList.value.totalElements / localPageSize.value))

// 获取诗歌列表
const fetchPoems = async (page: number) => {
  loading.value = true
  try {
    const result = await getPagedPoetPoems(page, localPageSize.value)
    // 根据实际接口结构处理数据
    poemList.value = result.data
  } catch (error) {
    console.error('获取诗歌列表失败:', error)
    poemList.value = {
      content: [],
      totalElements: 0
    }
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchPoems(page)
  emit('page-change', page)
}

// 处理页大小变化
const handlePageSizeChange = (size: number) => {
  const oldSize = localPageSize.value
  localPageSize.value = size
  
  // 计算新的当前页，保持数据位置一致
  const newPage = Math.floor((currentPage.value - 1) * oldSize / size) + 1
  currentPage.value = newPage
  
  fetchPoems(newPage)
  emit('page-change', newPage)
}

// 处理创建按钮点击
const onCreateClick = () => {
  emit('create')
}

// 处理诗歌点击
const onPoemClick = (poem: Poem) => {
  emit('poem-click', poem)
  // 可以根据需要导航到诗歌详情页
  router.push(`/poet-poem-detail/${poem.poemId}`)
}

// 监听窗口大小变化
const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobileStatus()
  window.addEventListener('resize', updateMobileStatus)
  fetchPoems(1)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus)
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

/* 分页组件样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px; /* 设置最大宽度 */
  margin: 0 auto;
  margin-top: 2rem;
}

.n-pagination {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式样式 */
@media (max-width: 767px) {
  .pagination-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .n-pagination {
    flex-wrap: wrap;
  }

  .n-pagination-item {
    margin-bottom: 8px;
  }
}
</style>