<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  NCard, 
  NGrid, 
  NGridItem, 
  NSpace, 
  NTag, 
  NPagination,
  NEmpty,
  NIcon,
  useMessage
} from 'naive-ui'
import { 
  ChatbubbleEllipsesOutline as CommentIcon 
} from '@vicons/ionicons5'
import router from '@/router'

// 诗歌解释帖子接口
interface PoemExplanation {
  id: number
  poemTitle: string
  poemAuthor: string
  explanationTitle: string
  briefIntro: string
  author: string
  tags: string[]
  commentCount: number
  createdAt: Date
}

// 模拟数据 - 实际应用中应从API获取
const explanationList = ref<PoemExplanation[]>([
  {
    id: 1,
    poemTitle: '静夜思',
    poemAuthor: '李白',
    explanationTitle: '月光下的乡愁',
    briefIntro: '解读李白《静夜思》中深藏的思乡之情...',
    author: '文学评论家张三',
    tags: ['唐诗', '乡愁', '抒情'],
    commentCount: 42,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 2,
    poemTitle: '登鹳雀楼',
    poemAuthor: '王之涣',
    explanationTitle: '边塞诗中的壮美景象',
    briefIntro: '细品边塞诗人笔下的壮丽山川...',
    author: '诗词学者李四',
    tags: ['边塞诗', '意境', '自然'],
    commentCount: 28,
    createdAt: new Date('2024-02-10')
  }
])

const goToDetail = (id: number) => {
  router.push({ 
    name: 'PoemExplanationDetail', 
    params: { id: id } 
  })
}

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// 分页相关
const currentPage = ref(1)
const pageSize = 6

</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-6xl mx-auto shadow-2xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        诗词解析集
      </h1>

      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <n-grid-item 
          v-for="explanation in explanationList" 
          :key="explanation.id"
          class="cursor-pointer hover:scale-105 transition-transform"
          @click="goToDetail(explanation.id)"
        >
          <n-card 
            :title="explanation.explanationTitle"
            class="h-full"
            hoverable
          >
            <template #header-extra>
              <n-tag size="small" type="info">
                {{ explanation.poemTitle }} - {{ explanation.poemAuthor }}
              </n-tag>
            </template>

            <div class="mb-4 text-gray-600">
              {{ explanation.briefIntro }}
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
                {{ explanation.author }} · 
                {{ explanation.createdAt.toLocaleDateString() }}
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