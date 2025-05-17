<template>
    <div class="comment-item bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
      <div class="comment-header flex items-center">
        <n-avatar 
          :src="comment.userAvatar || defaultAvatar" 
          size="small" 
          round
          class="mr-2"
          style="cursor: pointer"
          @click="navigateToUserPage"
        />
        <div class="user-info flex-grow">
          <div class="username font-semibold text-gray-800 dark:text-gray-200">{{ comment.userName }}</div>
          <div class="time text-xs text-gray-500 dark:text-green-100">{{ formatDate(comment.createdAt) }}</div>
        </div>
        <div class="actions">
          <like-switch 
            class="transform scale-75"
            :checked="comment.isLiked" 
            :disabled="isLoading"
            @change="handleLikeChange"
          />
        </div>
      </div>
      <div class="comment-content text-gray-700 dark:text-gray-200 mt-2">
        {{ comment.content }}
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  import { NAvatar } from 'naive-ui'
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import { debounce } from 'lodash-es'
  import type { Comment } from '@/types/comment'
  import LikeSwitch from '@/components/switch/likeSwitch.vue'
  import { showPrompt } from '@/components/functions/prompt'
  
  const router = useRouter()
  const defaultAvatar = '/default-avatar.png'
  const isLoading = ref(false)
  const lastClickTime = ref(0)
  
  const props = defineProps({
    comment: {
      type: Object as () => Comment,
      required: true
    }
  })
  
  const emit = defineEmits(['like'])

  // 使用lodash的debounce函数创建一个防抖的点赞事件发射器
  const debouncedEmit = debounce((comment: Comment) => {
    emit('like', comment)
    // 请求发出后延时重置isLoading状态，给动画/操作预留时间
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }, 300, { leading: false, trailing: true }) // 300ms延迟，忽略首次调用，确保最后一次调用被执行
    // 处理点赞变化的函数
  const handleLikeChange = (_isChecked: boolean) => {
    if (isLoading.value) return
    
    // 检查是否点击太快（间隔小于300ms）
    const now = Date.now()
    if (now - lastClickTime.value < 300) {
      showPrompt('info', '点击太快了，慢一点哦')
      return
    }
    
    // 更新最后点击时间
    lastClickTime.value = now
    
    // 设置加载状态，防止重复点击
    isLoading.value = true
    
    // 调用防抖后的emit函数
    debouncedEmit(props.comment)
  }
  
  const formatDate = (date: string) => {
    if (!date) return ''
    try {
      return new Date(date).toLocaleString()
    } catch (event) {
      return date
    }
  }

  const navigateToUserPage = () => {
    router.push({ 
      name: 'UserPersonalCenter',
      params: { username: props.comment.userName }
    })
  }
</script>