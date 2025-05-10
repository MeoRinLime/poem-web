<template>
  <div class="action-buttons flex flex-wrap justify-center sm:space-x-4 space-x-2 my-4 px-2">
    <n-button 
      :type="isLiked ? 'primary' : 'default'"
      round
      class="action-button text-sm sm:text-base mb-2 sm:mb-0"
      @click="$emit('toggle-like')"
    >
      <template #icon>
        <n-icon :component="isLiked ? HeartOutline : HeartDislikeOutline" />
      </template>
      <span class="button-text">点赞 ({{ likeCount }})</span>
    </n-button>
    
    <n-button 
      :type="isCollected ? 'primary' : 'default'"
      round
      class="action-button text-sm sm:text-base mb-2 sm:mb-0"
      @click="$emit('toggle-collect')"
    >
      <template #icon>
        <n-icon :component="BookmarkOutline" />
      </template>
      <span class="button-text">收藏 ({{ collectCount }})</span>
    </n-button>
    
    <n-popover trigger="hover" :show-arrow="false" placement="bottom">
      <template #trigger>
        <n-button round class="action-button text-sm sm:text-base mb-2 sm:mb-0" @click="$emit('share')">
          <template #icon>
            <n-icon :component="ShareSocialOutline" />
          </template>
          <span class="button-text">分享</span>
        </n-button>
      </template>
      <span>点击创建分享链接</span>
    </n-popover>
    
    <!-- 通过默认插槽接收AI按钮 -->
    <slot></slot>
    
    <!-- 为了向后兼容，保留旧的AI按钮逻辑 -->
    <AIButton
      v-if="showAIButton && !$slots.default"
      :text="aiButtonText"
      :loading="aiLoading"
      :disabled="aiDisabled"
      :color="aiColor"
      class="action-button mb-2 sm:mb-0"
      @click="handleAIButtonClick"
    />
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
import AIButton from './AIButton.vue'

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
  },
  aiButtonText: {
    type: String,
    default: 'AI 生成'
  },
  aiLoading: {
    type: Boolean,
    default: false
  },
  aiDisabled: {
    type: Boolean,
    default: false
  },
  aiColor: {
    type: String,
    default: '#06c8d9'
  },
  showAIButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-like', 'toggle-collect', 'share', 'ai-action'])

const handleAIButtonClick = (event: Event) => {
  emit('ai-action', event);
}
</script>

<style scoped>
/* 响应式样式 */
.action-buttons {
  width: 100%;
}

.action-button {
  min-height: 36px;
  padding: 0 12px;
}

/* 移动端样式调整 */
@media (max-width: 640px) {
  .action-button {
    min-width: calc(50% - 0.5rem);
    margin-right: 0.25rem;
    margin-left: 0.25rem;
    padding: 0 8px;
  }
  
  .button-text {
    font-size: 0.875rem;
  }
  
  /* 最后一个元素如果是奇数个按钮，则占据整行 */
  .action-button:last-child:nth-child(odd) {
    min-width: calc(100% - 0.5rem);
  }
}

/* 中等屏幕尺寸样式 */
@media (min-width: 641px) and (max-width: 768px) {
  .action-button {
    min-width: auto;
    padding: 0 10px;
  }
}
</style>