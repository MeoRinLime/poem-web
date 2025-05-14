<template>
    <div class="comment-item bg-white p-3 rounded-lg shadow-sm">
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
          <div class="username font-semibold text-gray-800">{{ comment.userName }}</div>
          <div class="time text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</div>
        </div>
        <div class="actions">
          <n-button 
            quaternary 
            size="small"
            :type="comment.isLiked ? 'primary' : 'default'"
            @click="$emit('like', comment)"
          >
            <template #icon>
              <n-icon :component="comment.isLiked ? HeartOutline : HeartDislikeOutline" />
            </template>
            {{ comment.countLike }}
          </n-button>
        </div>
      </div>
      <div class="comment-content text-gray-700 mt-2">
        {{ comment.content }}
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  import { NAvatar, NButton, NIcon } from 'naive-ui'
  import { HeartOutline, HeartDislikeOutline } from '@vicons/ionicons5'
  import { useRouter } from 'vue-router'
  import type { Comment } from '@/types/comment'
  const router = useRouter()
  const defaultAvatar = '/default-avatar.png'
  
  const props = defineProps({
    comment: {
      type: Object as () => Comment,
      required: true
    }
  })
  
  defineEmits(['like'])
  
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