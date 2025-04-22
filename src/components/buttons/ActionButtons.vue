<template>
  <div class="action-buttons flex justify-center space-x-4 my-4">
    <n-button 
      :type="isLiked ? 'primary' : 'default'"
      @click="$emit('toggle-like')"
    >
      <template #icon>
        <n-icon :component="isLiked ? HeartOutline : HeartDislikeOutline" />
      </template>
      点赞 ({{ likeCount }})
    </n-button>
    
    <n-button 
      :type="isCollected ? 'primary' : 'default'"
      @click="$emit('toggle-collect')"
    >
      <template #icon>
        <n-icon :component="BookmarkOutline" />
      </template>
      收藏 ({{ collectCount }})
    </n-button>
    
    <n-popover trigger="hover">
      <template #trigger>
        <n-button @click="$emit('share')">
          <template #icon>
            <n-icon :component="ShareSocialOutline" />
          </template>
          分享
        </n-button>
      </template>
      <span>点击创建分享链接</span>
    </n-popover>
  </div>
</template>

<script setup lang="ts">
import { NButton, NIcon, NPopover } from 'naive-ui'
import { 
  HeartOutline, 
  HeartDislikeOutline, 
  BookmarkOutline, 
  ShareSocialOutline 
} from '@vicons/ionicons5'

defineProps({
  likeCount: {
    type: Number,
    default: 0
  },
  collectCount: {
    type: Number,
    default: 0
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  isCollected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-like', 'toggle-collect', 'share'])
</script>