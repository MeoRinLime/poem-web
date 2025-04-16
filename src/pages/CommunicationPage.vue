<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
      :content-style="{ padding: '16px' }"
    >
      <!-- 页面标题和添加按钮 -->
      <div class="flex justify-between items-center mb-8">
        <BigTitle class="text-4xl font-bold text-gray-800" text="诗歌交流集" />
        <CreateButton 
          @click="goToNewCommunication"
        >
          新建交流
        </CreateButton>
      </div>

      <div v-if="CommunicationList.length === 0" class="flex items-center justify-center h-64">
        <LoadingComponent />
      </div>

      <!-- 诗歌列表 -->
      <n-grid :cols="isMobile ? 1 : 3" :x-gap="24" :y-gap="24">
        <n-grid-item 
          v-for="explanation in paginatedCommunications" 
          :key="explanation.postId"
          class="cursor-pointer hover:scale-105 transition-transform"
          @click="goToDetail(explanation.postId)"
        >
          <n-card 
            :title="explanation.title"
            class="h-full"
            hoverable
          >
            <div class="mb-4 text-gray-600">
              {{ explanation.content }}
            </div>

            <div class="flex justify-between items-center">
              <n-space>
                <n-tag 
                  v-for="tag in explanation.tags" 
                  :key="tag" 
                  size="small" 
                  type="success"
                >
                  {{ tag }}
                </n-tag>
              </n-space>

              <div class="flex items-center text-gray-500">
                <n-icon :component="CommentIcon" class="mr-1" />
                {{ explanation.commentCount }}
              </div>
            </div>

            <template #footer>
              <div class="text-right text-sm text-gray-500">
                {{ explanation.userName }} · 
                {{ explanation.createdAt }}
              </div>
            </template>
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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  NCard, 
  NGrid, 
  NGridItem, 
  NSpace, 
  NTag, 
  NPagination,
  NIcon
} from 'naive-ui'
import { 
  ChatbubbleEllipsesOutline as CommentIcon
} from '@vicons/ionicons5'
import router from '@/router'
import { getCommunicationList } from '@/api/post'
import CreateButton from '@/components/CreateButton.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

// 诗歌交流帖子接口
interface Communication {
  commentCount: number
  content: string
  createdAt: String
  poemAuthor: string
  poemTitle: string
  postId: number
  tags: string[]
  title: string
  userName: string
}

const CommunicationList = ref<Communication[]>([])

onMounted(() => {
  getCommunicationList().then((response: { data: any }) => {
    const data = response.data
    CommunicationList.value = data
  })
})

const isMobile = ref(false)

// 监听窗口大小变化
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

isMobile.value = window.innerWidth < 768

const goToDetail = (postId: number) => {
  router.push({ 
    name: 'CommunicationDetail', 
    params: { postId: postId } 
  })
}

const goToNewCommunication = () => {
  router.push({ 
    name: 'CreateCommunication' 
  })
}

// 分页相关
const currentPage = ref(1)
const pageSize = 6

const pageCount = computed(() => Math.ceil(CommunicationList.value.length / pageSize))

const paginatedCommunications = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return CommunicationList.value.slice(start, start + pageSize)
})

const handlePageChange = (page: number) => {
  currentPage.value = page
}
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
