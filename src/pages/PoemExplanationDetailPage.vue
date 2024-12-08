<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  NCard, 
  NAvatar, 
  NSpace, 
  NTag, 
  NDivider, 
  NInput,
  NButton,
  useMessage
} from 'naive-ui'
import { 
  SendOutline as SendIcon, 
  HeartOutline as HeartIcon,
  ChatbubbleOutline as CommentIcon
} from '@vicons/ionicons5'

// 评论接口
interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  createdAt: Date
  likes: number
}

// 诗歌解释详情接口
interface PoemExplanationDetail {
  id: number
  poemTitle: string
  poemAuthor: string
  explanationTitle: string
  content: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  createdAt: Date
  comments: Comment[]
}

// 模拟详情数据
const explanationDetail = ref<PoemExplanationDetail>({
  id: 1,
  poemTitle: '静夜思',
  poemAuthor: '李白',
  explanationTitle: '月光下的乡愁',
  content: `李白的《静夜思》是一首脍炙人口的抒情诗，短短四句诗道出了游子思乡的深切情感。
  
  "床前明月光"描绘了一个静谧的夜晚场景，月光如水般洒在床前。"疑是地上霜"的比喻生动地展现了月光的皎洁。
  
  最后两句"举头望明月，低头思故乡"是全诗的点睛之笔，通过抬头看月、低头思乡的动作，传达出无限的乡愁和思念之情。`,
  author: {
    name: '文学评论家张三',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  tags: ['唐诗', '乡愁', '抒情'],
  createdAt: new Date('2024-02-15'),
  comments: [
    {
      id: 1,
      author: '诗词爱好者',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      content: '李白的诗果然妙笔生花，每读一次都有新的感悟！',
      createdAt: new Date('2024-02-16'),
      likes: 12
    }
  ]
})

// 新评论
const newComment = ref('')

// 发送评论
const sendComment = () => {
  if (!newComment.value.trim()) {
    useMessage().warning('评论内容不能为空')
    return
  }

  // 模拟添加评论 - 实际应调用API
  explanationDetail.value.comments.push({
    id: explanationDetail.value.comments.length + 1,
    author: '当前用户',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: newComment.value,
    createdAt: new Date(),
    likes: 0
  })

  newComment.value = ''
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-4xl mx-auto shadow-2xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <!-- 解释标题和诗词信息 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ explanationDetail.explanationTitle }}
        </h1>
        <n-space justify="center" align="center" class="mb-4">
          <n-tag type="info">
            {{ explanationDetail.poemTitle }} - {{ explanationDetail.poemAuthor }}
          </n-tag>
          <n-tag 
            v-for="tag in explanationDetail.tags" 
            :key="tag" 
            type="success" 
            size="small"
          >
            {{ tag }}
          </n-tag>
        </n-space>
      </div>

      <!-- 作者信息 -->
      <div class="flex items-center mb-6">
        <n-avatar 
          :src="explanationDetail.author.avatar" 
          size="large" 
          class="mr-4"
        />
        <div>
          <div class="font-bold text-gray-800">
            {{ explanationDetail.author.name }}
          </div>
          <div class="text-sm text-gray-500">
            发布于 {{ explanationDetail.createdAt.toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- 解释正文 -->
      <div class="prose max-w-full mb-8 text-gray-700 leading-relaxed">
        {{ explanationDetail.content }}
      </div>

      <!-- 评论区 -->
      <n-divider title-placement="left">
        <n-icon :component="CommentIcon" class="mr-2" />
        评论区
      </n-divider>

      <!-- 发表评论 -->
      <div class="mb-6">
        <n-input 
          v-model:value="newComment"
          type="textarea"
          placeholder="分享您对这篇解析的看法..."
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
        <div class="text-right mt-2">
          <n-button 
            type="primary" 
            @click="sendComment"
            secondary
          >
            <template #icon>
              <n-icon :component="SendIcon" />
            </template>
            发布评论
          </n-button>
        </div>
      </div>

      <!-- 现有评论 -->
      <div v-if="explanationDetail.comments.length" class="space-y-4">
        <div 
          v-for="comment in explanationDetail.comments" 
          :key="comment.id" 
          class="bg-white p-4 rounded-lg shadow-sm"
        >
          <div class="flex items-center mb-2">
            <n-avatar 
              :src="comment.avatar" 
              size="small" 
              class="mr-3"
            />
            <div>
              <div class="font-semibold text-gray-800">
                {{ comment.author }}
              </div>
              <div class="text-xs text-gray-500">
                {{ comment.createdAt.toLocaleString() }}
              </div>
            </div>
            <div class="ml-auto flex items-center text-gray-500">
              <n-icon :component="HeartIcon" class="mr-1" />
              {{ comment.likes }}
            </div>
          </div>
          <div class="text-gray-700">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <n-empty 
        v-else 
        description="暂无评论，快来抢沙发！"
        class="my-6"
      />
    </n-card>
  </div>
</template>