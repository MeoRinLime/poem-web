<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  NCard, 
  NAvatar, 
  NSpace, 
  NTag, 
  NDivider, 
  NInput,
  NButton,
  useMessage,
  NEmpty,
} from 'naive-ui'
import { 
  SendOutline as SendIcon, 
  HeartOutline as HeartIcon,
  ChatbubbleOutline as CommentIcon,
  HeartDislikeOutline,
  BookmarkOutline,
  ShareSocialOutline
} from '@vicons/ionicons5'
import { getPostById } from '@/api/post'
import {
  likePost, 
  cancelLike, 
  subscribePost, 
  cancelSubscribe, 
  isLikePost, 
  isSubscribePost,
  likeComment,
  isLikeComment
} from '@/api/likeAndSub'
import { postComment } from '@/api/comment'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// 常量
const DEFAULT_AVATAR = '/default-avatar.png'
const message = useMessage()

// 评论接口
interface Comment {
  commentId: number
  userName: string
  content: string
  createdAt: string
  countLike: number
  isLiked: boolean
  likeId?: string
}

// 帖子详情接口
interface PostDetail {
  postId: number
  poemTitle: string
  poemAuthor: string
  title: string
  content: string
  userName: string
  tag: string[]
  createdAt: string
  comments: Comment[]
  likeCount: number
  favoriteCount: number
  likeId?: string
  favoritesId?: string
}

// 从路由中获取帖子 ID
const route = useRoute()
const postId = Number(route.params.postId)
const router = useRouter()
const authStore = useAuthStore()

const postDetail = ref<PostDetail | null>(null)
const isLiked = ref(false)
const isCollected = ref(false)
const newComment = ref('')

// 计算属性
const likeButtonType = computed(() => (isLiked.value ? 'primary' : 'default'))
const collectButtonType = computed(() => (isCollected.value ? 'primary' : 'default'))

// 获取帖子详情并检查点赞和收藏状态
const fetchPostDetail = async () => {
  try {
    // 获取帖子详情
    const data = await getPostById(postId)
    postDetail.value = data.data

    // 检查点赞和收藏状态
    if (authStore.username) {
      // 检查点赞状态
      const likeInfo = await isLikePost(postId, authStore.username)
      isLiked.value = !!likeInfo?.data.likeId
      if (postDetail.value) {
        postDetail.value.likeId = likeInfo?.data.likeId
      }

      // 检查收藏状态
      const subscribeInfo = await isSubscribePost(postId, authStore.username)
      isCollected.value = !!subscribeInfo?.data.favoritesId
      if (postDetail.value) {
        postDetail.value.favoritesId = subscribeInfo?.data.favoritesId
      }
    }

    // 检查每条评论的点赞状态
    await checkCommentLikeStatus()
  } catch (error: any) {
    message.error(error.message || '加载帖子详情失败')
  }
}

// 检查评论的点赞状态
const checkCommentLikeStatus = async () => {
  if (!authStore.username || !postDetail.value) return

  try {
    const updatedComments = await Promise.all(
      postDetail.value.comments.map(async (comment) => {
        const likeInfo = authStore.username ? await isLikeComment(comment.commentId, authStore.username) : null
        return { 
          ...comment, 
          isLiked: !!likeInfo?.data.likeId,
          likeId: likeInfo?.data.likeId 
        }
      })
    )
    postDetail.value.comments = updatedComments
  } catch (error) {
    console.error('检查评论点赞状态失败', error)
  }
}

onMounted(async () => {
  await fetchPostDetail()
})

// 点赞帖子功能
const toggleLike = async () => {
  if (!authStore.username) {
    message.warning('请先登录')
    return
  }

  const previousState = isLiked.value
  isLiked.value = !isLiked.value
  if (postDetail.value) {
    postDetail.value.likeCount += isLiked.value ? 1 : -1
  }

  try {
    if (isLiked.value) {
      // 点赞
      const likeData = await likePost(postId, authStore.username)
      postDetail.value!.likeId = likeData.likeId
      message.success('点赞成功')
    } else {
      // 取消点赞
      if (postDetail.value?.likeId) {
        await cancelLike(postDetail.value.likeId)
        postDetail.value.likeId = undefined
        message.success('取消点赞成功')
      }
    }
  } catch (error: any) {
    // 回滚状态
    isLiked.value = previousState
    if (postDetail.value) {
      postDetail.value.likeCount += isLiked.value ? 1 : -1
    }
    message.error(error.message || '点赞操作失败')
  }
}

// 收藏功能
const toggleCollect = async () => {
  if (!authStore.username) {
    message.warning('请先登录')
    return
  }

  const previousState = isCollected.value
  isCollected.value = !isCollected.value
  if (postDetail.value) {
    postDetail.value.favoriteCount += isCollected.value ? 1 : -1
  }

  try {
    if (isCollected.value) {
      // 收藏
      const collectData = await subscribePost(postId, authStore.username)
      postDetail.value!.favoritesId = collectData.favoritesId
      message.success('收藏成功')
    } else {
      // 取消收藏
      if (postDetail.value?.favoritesId) {
        await cancelSubscribe(postDetail.value.favoritesId)
        postDetail.value.favoritesId = undefined
        message.success('取消收藏成功')
      }
    }
  } catch (error: any) {
    // 回滚状态
    isCollected.value = previousState
    if (postDetail.value) {
      postDetail.value.favoriteCount += isCollected.value ? 1 : -1
    }
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
    if (comment.isLiked) {
      // 点赞评论
      const likeInfo = await likeComment(comment.commentId, authStore.username)
      comment.likeId = likeInfo.likeId
      message.success('评论点赞成功')
    } else {
      // 取消点赞评论
      if (comment.likeId) {
        await cancelLike(comment.likeId)
        comment.likeId = undefined
        message.success('取消评论点赞成功')
      }
    }
  } catch (error: any) {
    // 回滚状态
    comment.isLiked = previousState
    comment.countLike += comment.isLiked ? 1 : -1
    message.error(error.message || '评论点赞操作失败')
  }
}

// 发送评论
const sendComment = async () => {
  if (!newComment.value.trim()) {
    message.warning('评论内容不能为空')
    return
  }

  const userName = authStore.username

  try {
    const postCommentData = {
      objectId: postId, 
      objectType: 0, // 假设 0 表示帖子
      userName: userName,
      content: newComment.value,
    }

    await postComment(postCommentData)
    message.success('评论成功')
    newComment.value = ''

    // 重新获取帖子详情以更新评论列表
    await fetchPostDetail()
  } catch (error: any) {
    message.error(error.message || '评论发布失败')
    console.error(error)
  }
}

// 返回按钮功能
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-24">
    <n-card 
      class="max-w-4xl mx-auto shadow-2xl rounded-2xl"
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
          ← 返回日常交流贴列表
        </n-button>
      </div>

      <!-- 解释标题和诗词信息 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">
          {{ postDetail?.title }}
        </h1>
        <n-space justify="center" align="center" class="mb-4">
          <!-- <n-tag type="info">
            {{ postDetail?.poemTitle }} - {{ postDetail?.poemAuthor }}
          </n-tag> -->
          <n-tag 
            v-for="tag in postDetail?.tag" 
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
            {{ postDetail?.userName }}
          </div>
          <div class="text-sm text-gray-500">
            发布于 {{ postDetail?.createdAt.toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- 解释正文 -->
      <div class="prose max-w-full mb-8 text-gray-700 leading-relaxed">
        {{ postDetail?.content }}
      </div>

      <!-- 交互按钮 -->
      <div class="flex justify-center space-x-6 mb-10">
        <n-button 
          :type="likeButtonType"
          @click="toggleLike"
        >
          <template #icon>
            <n-icon :component="isLiked ? HeartIcon : HeartDislikeOutline" />
          </template>
          点赞 ({{ postDetail?.likeCount }})
        </n-button>

        <n-button 
          :type="collectButtonType"
          @click="toggleCollect"
        >
          <template #icon>
            <n-icon :component="BookmarkOutline" />
          </template>
          收藏 ({{ postDetail?.favoriteCount }})
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
            :disabled="!newComment.trim()"
            @click="sendComment"
          >
            <template #icon>
              <n-icon :component="SendIcon" />
            </template>
            发布评论
          </n-button>
        </div>
      </div>

      <!-- 现有评论 -->
      <div v-if="postDetail?.comments.length" class="space-y-4">
        <div 
          v-for="comment in postDetail?.comments" 
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
                {{ new Date(comment.createdAt).toLocaleString() }}
              </div>
            </div>
            <div class="ml-auto flex items-center">
              <n-button 
                quaternary 
                size="tiny"
                :type="comment.isLiked ? 'primary' : 'default'"
                class="mr-2"
                @click="toggleCommentLike(comment)"
              >
                <template #icon>
                  <n-icon :component="comment.isLiked ? HeartIcon : HeartDislikeOutline" />
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
      <n-empty 
        v-else 
        description="暂无评论，快来抢沙发！"
        class="my-6"
      />
    </n-card>
  </div>
</template>

<style scoped>
.prose {
  max-width: 100%;
  line-height: 1.8;
}
</style>
