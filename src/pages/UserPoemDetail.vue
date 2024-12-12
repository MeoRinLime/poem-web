<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  NCard, 
  NButton, 
  NIcon, 
  NAvatar, 
  NDivider, 
  NInput,
  NTag,
  NPopover,
  useMessage,
} from 'naive-ui'
import { 
  HeartOutline, 
  HeartDislikeOutline, 
  ShareSocialOutline, 
  BookmarkOutline,
} from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import { getUserPoem } from '@/api/poemUser'
import { useAuthStore } from '@/store/auth'
import { postComment } from '@/api/comment'
import { 
  likeUserPoem, 
  subscribeUserPoem, 
  isLikeUserPoem, 
  isSubscribeUserPoem, 
  likeComment, 
  isLikeComment,
  cancelLike,
  cancelSubscribe
} from '@/api/likeAndSub'

const DEFAULT_AVATAR = '/default-avatar.png'
const message = useMessage()
const router = useRouter()
const route = useRoute()
const poemId = Number(route.params.poemId)
const authStore = useAuthStore()

// 评论接口
interface Comment {
  commentId: number
  userName: string
  content: string
  createdAt: string
  countLike: number
  isLiked: boolean
  likeId?: number
}

// 定义诗歌类型
interface Poem {
  poemId: number
  authorName: string
  title: string
  subtitle?: string
  content: string
  createdAt: string
  likeCount: number
  favoriteCount: number
  commentCount: number
  comments: Comment[]
  likeId?: number
  favoritesId?: number
}

const poem = ref<Poem>({
  poemId: 0,
  authorName: '',
  title: '',
  subtitle: '',
  content: '',
  createdAt: '',
  likeCount: 0,
  favoriteCount: 0,
  commentCount: 0,
  comments: []
})

// 状态管理
const isLiked = ref(false)
const isCollected = ref(false)
const newComment = ref('')

// 计算属性
const likeButtonType = computed(() => (isLiked.value ? 'primary' : 'default'))
const collectButtonType = computed(() => (isCollected.value ? 'primary' : 'default'))

const checkCommentLikeStatus = async () => {
  if (!authStore.username) return
  
  try {
    const updatedComments = await Promise.all(
      poem.value.comments.map(async (comment) => {
        const likeInfo = await isLikeComment(comment.commentId, authStore.username!)
        return { 
          ...comment, 
          isLiked: !!likeInfo?.data?.likeId,
          likeId: likeInfo?.data.likeId 
        }
      })
    )
    
    poem.value.comments = updatedComments
  } catch (error) {
    console.error('检查评论点赞状态失败', error)
  }
}

const checkPoemLikeStatus = async () => {
  if (!authStore.username) return

  try {
    const [likeInfo, subscribeInfo] = await Promise.all([
      isLikeUserPoem(poemId, authStore.username),
      isSubscribeUserPoem(poemId, authStore.username)
    ])
    
    isLiked.value = !!likeInfo?.data?.likeId
    isCollected.value = !!subscribeInfo?.data?.favoritesId

    // 存储 likeId 和 favoritesId
    poem.value.likeId = likeInfo?.data.likeId
    poem.value.favoritesId = subscribeInfo?.data.favoritesId
  } catch (error) {
    console.error('检查诗歌状态失败', error)
  }
}

onMounted(async () => {
  try {
    const response = await getUserPoem(poemId)
    poem.value = response.data
    await Promise.all([
      checkCommentLikeStatus(),
      checkPoemLikeStatus()
    ])
  } catch (error) {
    message.error('加载诗歌详情失败')
  }
})

// 点赞诗歌功能
const toggleLike = async () => {
  if (!authStore.username) {
    message.warning('请先登录')
    return
  }

  const previousState = isLiked.value
  isLiked.value = !isLiked.value
  poem.value.likeCount += isLiked.value ? 1 : -1

  try {
    if (!isLiked.value && poem.value.likeId) {
      // 取消点赞
      await cancelLike(poem.value.likeId.toString())
      poem.value.likeId = undefined
    } else {
      // 点赞
      await likeUserPoem(poemId, authStore.username)
      const likeInfo = await isLikeUserPoem(poemId, authStore.username)
      poem.value.likeId = likeInfo?.data.likeId
    }
  } catch (error: any) {
    // 回滚状态
    isLiked.value = previousState
    poem.value.likeCount += isLiked.value ? 1 : -1
    message.error(error.message || '点赞操作失败')
  }
}

// 收藏/订阅功能
const toggleCollect = async () => {
  if (!authStore.username) {
    message.warning('请先登录')
    return
  }

  const previousState = isCollected.value
  isCollected.value = !isCollected.value
  poem.value.favoriteCount += isCollected.value ? 1 : -1

  try {
    if (!isCollected.value && poem.value.favoritesId) {
      // 取消收藏
      await cancelSubscribe(poem.value.favoritesId.toString())
      poem.value.favoritesId = undefined
    } else {
      // 收藏
      await subscribeUserPoem(poemId, authStore.username)
      const subscribeInfo = await isSubscribeUserPoem(poemId, authStore.username)
      poem.value.favoritesId = subscribeInfo?.data.favoritesId
    }
  } catch (error: any) {
    // 回滚状态
    isCollected.value = previousState
    poem.value.favoriteCount += isCollected.value ? 1 : -1
    message.error(error.message || '收藏操作失败')
  }
}

// 点赞评论功能
const toggleCommentLike = async (comment: Comment) => {
  if (!authStore.username) {
    message.warning('请先登录')
    return
  }

  const previousState = comment.isLiked
  comment.isLiked = !comment.isLiked
  comment.countLike += comment.isLiked ? 1 : -1

  try {
    if (!comment.isLiked && comment.likeId) {
      // 取消点赞
      await cancelLike(comment.likeId.toString())
      comment.likeId = undefined
    } else {
      // 点赞
      await likeComment(comment.commentId, authStore.username)
      const likeInfo = await isLikeComment(comment.commentId, authStore.username!)
      comment.likeId = likeInfo?.data.likeId
    }
  } catch (error: any) {
    // 回滚状态
    comment.isLiked = previousState
    comment.countLike += comment.isLiked ? 1 : -1
    message.error(error.message || '点赞操作失败')
  }
}

// 发布评论
const sendComment = () => {
  if (!newComment.value.trim()) {
    message.warning('评论内容不能为空')
    return
  }
  const userName = authStore.username
  const postCommentData = {
    objectId: poemId, 
    objectType: 1,
    userName: userName,
    content: newComment.value,
  }
  postComment(postCommentData).then(async () => {
    message.success('评论成功')
    // 重新获取帖子详情
    const response = await getUserPoem(poemId)
    poem.value = response.data
    await checkCommentLikeStatus()
    newComment.value = ''
  }).catch((error) => {
    message.error('评论发布失败')
    console.error(error)
  })
}

// 返回列表
const goBack = () => {
  router.push({ name: 'UserPoemList' })
}
</script>


<template>
  <div class="min-h-screen flex justify-center p-24">
    <n-card 
      class="max-w-4xl w-full shadow-xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <!-- 返回按钮 -->
      <div class="flex justify-between items-center mb-8">
        <n-button 
          type="success"
          round
          class="text-white hover:text-yellow-500"
          @click="goBack"
        >
          ← 返回诗歌长廊
        </n-button>
      </div>

      <!-- 诗歌标题区域 -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ poem.title }}
        </h1>
        <div class="flex justify-center items-center space-x-2">
          <n-tag 
            v-if="poem.subtitle" 
            size="small" 
            type="info"
          >
            {{ poem.subtitle }}
          </n-tag>
          <span class="text-gray-500 text-sm">
            {{ poem.authorName }} · {{ poem.createdAt }}
          </span>
        </div>
      </div>

      <!-- 诗歌内容 -->
      <div class="prose prose-lg text-center text-gray-700 whitespace-pre-line mb-10">
        {{ poem.content }}
      </div>

      <!-- 交互按钮 -->
      <div class="flex justify-center space-x-6 mb-10">
        <n-button 
          :type="isLiked ? 'primary' : 'default'"
          @click="toggleLike"
        >
          <template #icon>
            <n-icon :component="isLiked ? HeartOutline : HeartDislikeOutline" />
          </template>
          点赞 ({{ poem.likeCount }})
        </n-button>

        <n-button 
          :type="isCollected ? 'primary' : 'default'"
          @click="toggleCollect"
        >
          <template #icon>
            <n-icon :component="BookmarkOutline" />
          </template>
          收藏 ({{ poem.favoriteCount }})
        </n-button>

        <n-popover trigger="hover">
          <template #trigger>
            <n-button>
              <template #icon>
                <n-icon :component="ShareSocialOutline" />
              </template>
              分享
            </n-button>
          </template>
          分享功能开发中
        </n-popover>
      </div>

      <!-- 评论区 -->
      <n-divider>评论 ({{ poem?.comments.length }})</n-divider>

      <!-- 发布评论 -->
      <div class="mb-6">
        <n-input 
          v-model:value="newComment"
          type="textarea" 
          placeholder="分享您的想法..."
          :autosize="{ minRows: 3, maxRows: 6 }"
          class="mb-3"
        />
        <div class="flex justify-end">
          <n-button 
            type="primary" 
            :disabled="!newComment.trim()"
            @click="sendComment"
          >
            发布评论
          </n-button>
        </div>
      </div>

      <!-- 评论列表 -->
      <div v-if="poem?.comments.length" class="space-y-4">
        <div 
          v-for="comment in poem?.comments" 
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
            <!-- 点赞按钮 -->
            <div class="ml-auto flex items-center">
              <n-button 
                quaternary 
                size="tiny"
                :type="comment.isLiked ? 'primary' : 'default'"
                class="mr-2"
                @click="toggleCommentLike(comment)"
              >
                <template #icon>
                  <n-icon :component="HeartOutline" />
                </template>
                {{ comment.countLike }}
              </n-button>
            </div>
          </div>
          <div class="text-gray-700">
            {{ comment.content }}
          </div>
        </div>
      </div>
      <div 
        v-else 
        class="text-center text-gray-500 py-8"
      >
        还没有评论，快来抢沙发吧！
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.prose {
  max-width: 100%;
  line-height: 1.8;
}
</style>