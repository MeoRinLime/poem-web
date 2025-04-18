<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
      :content-style="{ padding: '32px' }"
    >
      <div class="flex justify-between items-center mb-8">
        <BigTitle text="诗歌解析" />
        <CreateButton 
          @click="goToNewExplanation"
        >
          新建解析
        </CreateButton>
      </div>

      <div v-if="explanationList.length === 0" class="flex items-center justify-center h-64">
        <LoadingComponent />
      </div>

      <n-grid :cols="isMobile ? 1 : 3" :x-gap="16" :y-gap="16">
        <n-grid-item 
          v-for="explanation in explanationList" 
          :key="explanation.postId"
          class="cursor-pointer hover:scale-105 transition-transform"
          @click="goToDetail(explanation.postId)"
        >
          <n-card 
            :title="explanation.title"
            class="h-full"
            hoverable
          >
            <template #header-extra>
              <n-tag size="small" type="info">
                {{ explanation.poemTitle }} - {{ explanation.poemAuthor }}
              </n-tag>
            </template>

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

      <div class="mt-8 flex justify-center">
        <n-pagination 
          v-model:page="currentPage"
          :page-count="Math.ceil(explanationList.length / pageSize)"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
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
import { getPoemExplanationList } from '@/api/post'
import CreateButton from '@/components/CreateButton.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

// 诗歌解释帖子接口
interface PoemExplanation {
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

const explanationList = ref<PoemExplanation[]>([])

onMounted(() => {
  getPoemExplanationList().then((response: { data: any }) => {
    const data = response.data
    explanationList.value = data
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
    name: 'PoemExplanationDetail', 
    params: { postId: postId } 
  })
}

const goToNewExplanation = () => {
  router.push({ 
    name: 'CreatePoemExplanation' 
  })
}

// 分页相关
const currentPage = ref(1)
const pageSize = 6
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

@media (max-width: 768px) {
  .p-24 {
    padding: 16px;
  }
  .text-4xl {
    font-size: 18px;
  }
}
</style>
