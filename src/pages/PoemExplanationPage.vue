<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  NCard, 
  NGrid, 
  NGridItem, 
  NSpace, 
  NTag, 
  NPagination,
  NButton,
  NIcon
} from 'naive-ui'
import { 
  ChatbubbleEllipsesOutline as CommentIcon,
  AddCircleOutline as AddIcon
} from '@vicons/ionicons5'
import router from '@/router'
import { getPoemExplanationList } from '@/api/post'

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
    console.log('data:', data)
  })
})
  

const goToDetail = (id: number) => {
  router.push({ 
    name: 'PoemExplanationDetail', 
    params: { id: id } 
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

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800">
          诗词解析集
        </h1>
        <n-button 
          type="primary" 
          size="large" 
          @click="goToNewExplanation"
        >
          <template #icon>
            <n-icon :component="AddIcon" />
          </template>
          撰写新解析
        </n-button>
      </div>

      <n-grid :cols="3" :x-gap="16" :y-gap="16">
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

<style scoped>
.bg-gradient-to-br {
  background: linear-gradient(to bottom right, #EFF6FF, #C7D2FE);
}
</style>