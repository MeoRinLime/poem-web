<template>
    <div class="min-h-screen flex flex-col items-center p-4">
      <n-card 
        class="max-w-4xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
        :content-style="{ padding: '16px' }"
      >
        <!-- 返回按钮和删除按钮 -->
        <div class="flex justify-between items-center mb-8">
          <n-button 
            type="success"
            round
            class="text-white hover:text-yellow-500"
            @click="goBack"
          >
            ← {{ backText }}
          </n-button>
          <n-button v-if="canDelete" type="error" ghost @click="showDeleteConfirm">
            删除
          </n-button>
        </div>
  
        <!-- 确认删除对话框 -->
        <delete-confirm-modal
          v-model:visible="showDeleteModal"
          :title="detail.title"
          @confirm="handleDelete"
        />
  
        <!-- 标题区域 -->
        <div class="flex flex-col items-center mb-6">
          <div class="flex items-center justify-center mb-2">
            <n-avatar 
              v-if="!route.path.includes('/poet-poem')" 
              :src="detail.author?.avatar || DEFAULT_AVATAR" 
              round 
              size="large" 
              class="mr-3" 
            />
            <h1 class="text-2xl md:text-4xl font-bold text-gray-800">
              {{ detail.title }}
            </h1>
          </div>
          
          <!-- 副标题/标签 -->
          <div v-if="detail.type === 'poem' && detail.subtitle" class="flex justify-center items-center mt-2">
            <n-tag size="small" type="info">{{ detail.subtitle }}</n-tag>
          </div>
          <n-space v-if="detail.type === 'post' && detail.tags?.length" justify="center" align="center" class="mt-2">
            <n-tag 
              v-for="tag in detail.tags" 
              :key="tag" 
              type="success" 
              size="small"
            >
              {{ tag }}
            </n-tag>
          </n-space>
          
          <!-- 作者和日期 -->
          <div class="text-gray-500 text-sm mt-2">
            {{ detail.author?.name }}
            <template v-if="!route.path.includes('/poet-poem')">
              · {{ formatDate(detail.author?.createdAt) }}
            </template>
          </div>
        </div>
  
        <!-- 内容 -->
        <div 
          :class="[
            'prose max-w-full mb-6 text-gray-700',
            detail.type === 'poem' ? 'text-center whitespace-pre-line leading-relaxed' : 'leading-relaxed'
          ]"
        >
          {{ detail.content }}
        </div>
  
        <!-- 音频播放器（诗歌朗读功能）-->
        <audio-player 
          v-if="showAudioPlayer"
          :src="detail.audioUrl"
          :title="detail.title"
          :author="detail.author?.name"
          :recitation-id="Number(props.contentId)"
          :use-play-api="props.contentType === 'recitation'"
        />
  
        <!-- 交互按钮 -->
        <action-buttons
          :like-count="detail.likeCount"
          :collect-count="detail.favoriteCount"
          :is-liked="isLiked"
          :is-collected="isCollected"
          @toggle-like="toggleLike"
          @toggle-collect="toggleCollect"
          @share="handleShare"
        />
  
        <!-- 评论区 -->
        <comment-section 
          v-model:new-comment="newComment"
          :comments="detail.comments || []"
          @post-comment="postCommentHere"
          @like-comment="toggleCommentLike"
        />
      </n-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { 
    NCard, 
    NButton, 
    NAvatar, 
    NSpace, 
    NTag,
    useMessage
  } from 'naive-ui'
  import { useAuthStore } from '@/store/auth'
  import { getUserAvatarByUsername } from '@/api/personalCenter'
  
  // 引入子组件
  import AudioPlayer from '@/components/detail/AudioPlayer.vue'
  import CommentSection from '@/components/detail/CommentSection.vue'
  import ActionButtons from '@/components/buttons/ActionButtons.vue'
  import DeleteConfirmModal from '@/components/detail/DeleteConfirmModal.vue'
  
  // 引入类型定义
  import type { Comment } from '@/types/comment'
  import type { Poem } from '@/types/poem'
  import type { PostDetail } from '@/types/post'
  import type { Recitation } from '@/types/recitation'
  
  import {
  likePost, cancelLike, isLikePost, likeUserPoem, isLikeUserPoem,
  subscribePost, cancelSubscribe, isSubscribePost, subscribeUserPoem, isSubscribeUserPoem,
  likeComment,isLikeComment,
  } from '@/api/likeAndSub'
  import { postComment } from '@/api/comment'
  import { getPostById, deletePost } from '@/api/post'
  import { getUserPoem, deleteUserPoem } from '@/api/poemUser'
  import { getRecitationDetail, deleteRecitation } from '@/api/recitation'
  import { getPoetPoem } from '@/api/poemPoet'
  
  const props = defineProps({
    contentType: {
      type: String,
      required: true,
      validator: (val: string) => ['poem', 'post'].includes(val)
    },
    contentId: {
      type: [String, Number],
      required: true
    },
    backText: {
      type: String,
      default: '返回列表'
    },
    showAudioPlayer: {
      type: Boolean,
      default: false
    }
  })
  
  // 常量和工具
  const DEFAULT_AVATAR = '/default-avatar.png'
  const message = useMessage()
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  
  // 状态
  type DetailContent = {
    id: number;
    title: string;
    content: string;
    subtitle?: string;
    tags?: string[];
    type: 'poem' | 'post';
    author: {
      name: string;
      avatar?: string;
      createdAt?: string;
    };
    comments: Comment[];
    likeCount: number;
    favoriteCount: number;
    likeId?: number;
    favoritesId?: number;
    audioUrl?: string;
  }
  
  const detail = ref<DetailContent>({
    id: 0,
    title: '',
    content: '',
    type: props.contentType as 'poem' | 'post',
    author: {
      name: '',
      avatar: DEFAULT_AVATAR
    },
    comments: [],
    likeCount: 0,
    favoriteCount: 0
  })
  const isLiked = ref(false)
  const isCollected = ref(false)
  const newComment = ref('')
  const showDeleteModal = ref(false)
  
  // 计算属性
  const canDelete = computed(() => {
    return authStore.username && detail.value?.author?.name === authStore.username
  })
  
  // 方法
  const loadDetail = async () => {
    try {
      // 根据contentType决定使用哪个API
      let response
      if (props.contentType === 'poem') {
        // 根据路由参数判断是用户诗歌还是诗人诗歌
        const isUserPoem = route.path.includes('user-poem')
        if (isUserPoem) {
          response = await getUserPoem(Number(props.contentId))
        } else {
          response = await getPoetPoem(Number(props.contentId))
        }
      } else if (props.contentType === 'post') {
        response = await getPostById(Number(props.contentId))
      } else if (props.contentType === 'recitation') {
        response = await getRecitationDetail(Number(props.contentId))
      } else {
        throw new Error('未知的内容类型')
      }
      
      if (!response.data) {
        detail.value = transformData(response)
      } else {
        detail.value = transformData(response.data)
      }
      // 检查点赞和收藏状态
      await checkLikeCollectStatus()
      
      // 加载用户头像
      if (!route.path.includes('poet-poem')) {
        await loadAvatars()
      }
    } catch (error) {
      console.error('加载详情失败', error)
      message.error('加载详情失败')
    }
  }
  
  // 统一数据格式
  const transformData = (data: any): DetailContent => {
    if (props.contentType === 'poem') {
      //console.log('poem', data)
      return {
        id: data.poemId,
        title: data.title,
        subtitle: data.subtitle,
        content: data.content,
        type: 'poem',
        author: {
          name: data.authorName,
          createdAt: data.createdAt
        },
        comments: data.comments || [],
        likeCount: data.likeCount || 0,
        favoriteCount: data.favoriteCount || 0,
        likeId: data.likeId,
        favoritesId: data.favoritesId,
        audioUrl: data.audioUrl
      }
    } else if (props.contentType === 'post') {
      return {
        id: data.postId,
        title: data.title,
        content: data.content,
        tags: data.tag,
        type: 'post',
        author: {
          name: data.userName,
          createdAt: data.createdAt
        },
        comments: data.comments || [],
        likeCount: data.likeCount || 0,
        favoriteCount: data.favoriteCount || 0,
        likeId: data.likeId,
        favoritesId: data.favoritesId
      }
    } else if (props.contentType === 'recitation') {
      //console.log('recitation', data)
      return {
        id: data.recitationId,
        title: data.title,
        content: data.content,
        type: 'poem',
        author: {
          name: data.authorName,
          createdAt: data.createdAt
        },
        comments: data.comments || [],
        likeCount: data.likeCount || 0,
        favoriteCount: data.favoriteCount || 0,
        likeId: data.likeId,
        favoritesId: data.favoritesId,
        audioUrl: data.url
      }
    }
    
    // 默认返回空对象
    return detail.value
  }
  
  // 检查点赞收藏状态
  const checkLikeCollectStatus = async () => {
    if (!authStore.username) return
    
    try {
      let likeInfo, subscribeInfo
      
      if (props.contentType === 'poem') {
        likeInfo = await isLikeUserPoem(detail.value.id, authStore.username)
        subscribeInfo = await isSubscribeUserPoem(detail.value.id, authStore.username)
      } else {
        likeInfo = await isLikePost(detail.value.id, authStore.username)
        subscribeInfo = await isSubscribePost(detail.value.id, authStore.username)
      }
      
      isLiked.value = !!likeInfo?.data?.likeId
      isCollected.value = !!subscribeInfo?.data?.favoritesId
      
      // 存储IDs
      detail.value.likeId = likeInfo?.data?.likeId
      detail.value.favoritesId = subscribeInfo?.data?.favoritesId
    } catch (error) {
      console.error('检查点赞收藏状态失败', error)
    }
  }
  
  // 检查评论点赞状态
  const checkCommentLikeStatus = async () => {
    if (!authStore.username || !detail.value.comments?.length) return
    
    try {
      const updatedComments = await Promise.all(
        detail.value.comments.map(async (comment) => {
          const likeInfo = await isLikeComment(comment.commentId, authStore.username!)
          return { 
            ...comment, 
            isLiked: !!likeInfo?.data?.likeId,
            likeId: likeInfo?.data?.likeId 
          }
        })
      )
      
      detail.value.comments = updatedComments
    } catch (error) {
      console.error('检查评论点赞状态失败', error)
    }
  }
  
  // 加载头像
  const loadAvatars = async () => {
    try {
      // 加载作者头像
      if (detail.value.author?.name) {
        detail.value.author.avatar = await getUserAvatarByUsername(detail.value.author.name)
          .catch(() => DEFAULT_AVATAR)
      }
      
      // 加载评论者头像
      if (detail.value.comments?.length) {
        const promises = detail.value.comments.map(async (comment) => {
          try {
            comment.userAvatar = await getUserAvatarByUsername(comment.userName)
          } catch {
            comment.userAvatar = DEFAULT_AVATAR
          }
          return comment
        })
        
        detail.value.comments = await Promise.all(promises)
      }
    } catch (error) {
      console.error('加载头像失败', error)
    }
  }
  
  // 点赞/取消点赞
  const toggleLike = async () => {
    if (!authStore.username) {
      message.warning('请先登录')
      return
    }
  
    const previousState = isLiked.value
    isLiked.value = !isLiked.value
    detail.value.likeCount += isLiked.value ? 1 : -1
  
    try {
      if (props.contentType === 'poem') {
        if (!isLiked.value && detail.value.likeId) {
          // 取消点赞
          await cancelLike(detail.value.likeId)
          detail.value.likeId = undefined
        } else {
          // 点赞
          await likeUserPoem(detail.value.id, authStore.username)
          const likeInfo = await isLikeUserPoem(detail.value.id, authStore.username)
          detail.value.likeId = likeInfo?.data?.likeId
        }
      } else {
        if (!isLiked.value && detail.value.likeId) {
          // 取消点赞
          await cancelLike(detail.value.likeId)
          detail.value.likeId = undefined
        } else {
          // 点赞
          const likeData = await likePost(detail.value.id, authStore.username)
          detail.value.likeId = likeData.likeId
        }
      }
      
      message.success(isLiked.value ? '点赞成功' : '取消点赞成功')
    } catch (error: any) {
      // 回滚状态
      isLiked.value = previousState
      detail.value.likeCount += isLiked.value ? 1 : -1
      message.error(error.message || '点赞操作失败')
    }
  }
  
  // 收藏/取消收藏
  const toggleCollect = async () => {
    if (!authStore.username) {
      message.warning('请先登录')
      return
    }
  
    const previousState = isCollected.value
    isCollected.value = !isCollected.value
    detail.value.favoriteCount += isCollected.value ? 1 : -1
  
    try {
      if (props.contentType === 'poem') {
        if (!isCollected.value && detail.value.favoritesId) {
          // 取消收藏
          await cancelSubscribe(detail.value.favoritesId.toString())
          detail.value.favoritesId = undefined
        } else {
          // 收藏
          await subscribeUserPoem(detail.value.id, authStore.username)
          const subscribeInfo = await isSubscribeUserPoem(detail.value.id, authStore.username)
          detail.value.favoritesId = subscribeInfo?.data?.favoritesId
        }
      } else {
        if (!isCollected.value && detail.value.favoritesId) {
          // 取消收藏
          await cancelSubscribe(detail.value.favoritesId.toString())
          detail.value.favoritesId = undefined
        } else {
          // 收藏
          const collectData = await subscribePost(detail.value.id, authStore.username)
          detail.value.favoritesId = collectData.favoritesId
        }
      }
      
      message.success(isCollected.value ? '收藏成功' : '取消收藏成功')
    } catch (error: any) {
      // 回滚状态
      isCollected.value = previousState
      detail.value.favoriteCount += isCollected.value ? 1 : -1
      message.error(error.message || '收藏操作失败')
    }
  }
  
  // 点赞评论
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
        await cancelLike(comment.likeId)
        comment.likeId = undefined
      } else {
        // 点赞
        await likeComment(comment.commentId, authStore.username)
        const likeInfo = await isLikeComment(comment.commentId, authStore.username!)
        comment.likeId = likeInfo?.data?.likeId
      }
    } catch (error: any) {
      // 回滚状态
      comment.isLiked = previousState
      comment.countLike += comment.isLiked ? 1 : -1
      message.error(error.message || '评论点赞操作失败')
    }
  }
  
  // 发布评论
  const postCommentHere = async () => {
    if (!newComment.value.trim()) {
      message.warning('评论内容不能为空')
      return
    }
    
    if (!authStore.username) {
      message.warning('请先登录')
      return
    }
  
    try {
      const postCommentData = {
        objectId: detail.value.id, 
        objectType: props.contentType === 'poem' ? 1 : 0, // 0表示帖子，1表示诗歌
        userName: authStore.username,
        content: newComment.value,
      }
  
      await postComment(postCommentData)
      message.success('评论成功')
      newComment.value = ''
  
      // 重新获取详情以更新评论列表
      await loadDetail()
    } catch (error: any) {
      message.error(error.message || '评论发布失败')
      console.error(error)
    }
  }
  
  // 分享功能
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      message.success('已复制网址，可以分享给其他用户')
    } catch {
      message.error('复制失败，请手动复制网址')
    }
  }
  
  // 删除功能
  const showDeleteConfirm = () => {
    showDeleteModal.value = true
  }
  
  const handleDelete = async () => {
    try {
      if (props.contentType === 'poem') {
        await deleteUserPoem([detail.value.id])
        message.success('诗歌删除成功')
        router.push({ name: 'UserPoemList' })
      } else if (props.contentType === 'post') {
        await deletePost([detail.value.id])
        message.success('帖子删除成功')
        router.push({ name: 'Home' })
      } else if (props.contentType === 'recitation') {
        await deleteRecitation(detail.value.id)
        message.success('朗读删除成功')
        router.push({ name: 'RecitationList' })
      }
      else {
        // 帖子删除API待实现
        message.info('删除帖子功能开发中')
      }
    } catch (error) {
      message.error('删除失败')
      console.error(error)
    }
  }
  // 格式化日期
  const formatDate = (date: string | undefined) => {
    if (!date) return ''
    try {
      return new Date(date).toLocaleString()
    } catch (error) {
      return date
    }
  }
  
  // 返回按钮功能
  const goBack = () => {
    router.back()
  }
  
  // 在组件挂载时加载数据
  onMounted(loadDetail)
  </script>
  
  <style scoped>
  .prose {
    max-width: 100%;
    line-height: 1.6;
  }
  
  @media (max-width: 768px) {
    .prose {
      font-size: 14px;
    }
  }
  </style>