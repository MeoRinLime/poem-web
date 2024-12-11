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
import { getPostById } from '@/api/post';
import { postComment } from '@/api/comment';
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth';

const DEFAULT_AVATAR = '/default-avatar.png'
const message = useMessage()
// 评论接口
interface Comment {
  commentId: number
  userName: string
  content: string
  createdAt: string
  countLike: number
}

// 诗歌解释详情接口
interface PoemExplanationDetail {
  postId: number
  poemTitle: string
  poemAuthor: string
  title: string
  content: string
  userName: string
  tag: string[]
  createdAt: Date
  comments: Comment[]
}
// 从路由中获取帖子 ID
const route = useRoute()
const postId = Number(route.params.postId)
const explanationDetail = ref<PoemExplanationDetail | null>(null)

onMounted(async () => {
  getPostById(postId).then((response: { data: any }) => {
    const data = response.data
    explanationDetail.value = data
    //console.log('data:', data)
  })
})

// 新评论
const newComment = ref('')

// 发送评论
const sendComment = () => {
  if (!newComment.value.trim()) {
    message.warning('评论内容不能为空')
    return
  }
  const userName = useAuthStore().username
  const postCommentData = {
    objectId: postId, 
    objectType: 0,
    userName: userName,
    content: newComment.value,
  }
  postComment(postCommentData).then(() => {
    message.success('评论成功')
    // 重新获取帖子详情
    getPostById(postId).then((response: { data: any }) => {
      const data = response.data
      explanationDetail.value = data
    })
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
          {{ explanationDetail?.title }}
        </h1>
        <n-space justify="center" align="center" class="mb-4">
          <n-tag type="info">
            {{ explanationDetail?.poemTitle }} - {{ explanationDetail?.poemAuthor }}
          </n-tag>
          <n-tag 
            v-for="tag in explanationDetail?.tag" 
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
          :src="DEFAULT_AVATAR" 
          size="large" 
          class="mr-4"
        />
        <div>
          <div class="font-bold text-gray-800">
            {{ explanationDetail?.userName }}
          </div>
          <div class="text-sm text-gray-500">
            发布于 {{ explanationDetail?.createdAt.toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- 解释正文 -->
      <div class="prose max-w-full mb-8 text-gray-700 leading-relaxed">
        {{ explanationDetail?.content }}
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
      <div v-if="explanationDetail?.comments.length" class="space-y-4">
        <div 
          v-for="comment in explanationDetail?.comments" 
          :key="comment.commentId" 
          class="bg-white p-4 rounded-lg shadow-sm"
        >
          <div class="flex items-center mb-2">
            <n-avatar 
              :src="DEFAULT_AVATAR" 
              size="small" 
              class="mr-3"
            />
            <div>
              <div class="font-semibold text-gray-800">
                {{ comment.userName }}
              </div>
              <div class="text-xs text-gray-500">
                {{ comment.createdAt.toLocaleString() }}
              </div>
            </div>
            <div class="ml-auto flex items-center text-gray-500">
              <n-icon :component="HeartIcon" class="mr-1" />
              {{ comment.countLike }}
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