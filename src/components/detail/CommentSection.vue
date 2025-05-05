<template>
  <div class="comment-section">
    <n-divider title-placement="left">
      <n-icon :component="CommentIcon" class="mr-2" />
      评论区
    </n-divider>
    
    <!-- 评论输入框 -->
    <div class="comment-input mb-4">
      <n-input 
        v-model:value="localComment"
        type="textarea" 
        placeholder="写下您的评论..."
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
      <div class="submit-btn flex justify-end mt-2">
        <SendButton text="发送评论" @click="submit" />
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div v-if="comments.length" class="comment-list space-y-2">
      <comment-item
        v-for="comment in comments"
        :key="comment.commentId"
        :comment="comment"
        @like="handleLike"
      />
    </div>
    
    <!-- 空状态 -->
    <n-empty 
      v-else
      description="暂无评论，快来抢沙发！"
      class="my-4"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { NDivider, NInput, NButton, NIcon, NEmpty } from 'naive-ui'
  import { SendOutline as SendIcon, ChatbubbleOutline as CommentIcon } from '@vicons/ionicons5'
  import CommentItem from './CommentItem.vue'
  import type { Comment } from '@/types/comment'
  
  const loading = ref(false)
  const props = defineProps({
    comments: {
      type: Array as () => Comment[],
      default: () => []
    },
    newComment: {
      type: String,
      default: ''
    }
  })
  
  const emit = defineEmits(['update:newComment', 'post-comment', 'like-comment'])
  
  const localComment = ref(props.newComment)
  
  watch(() => props.newComment, (val, old) => {
    localComment.value = val
    if (old && !val) {
      loading.value = false
    }
  })
  
  watch(localComment, (val) => {
    emit('update:newComment', val)
  })
  
  const submit = () => {
    if (localComment.value.trim() && !loading.value) {
      loading.value = true
      emit('post-comment')
    }
  }
  
  const handleLike = (comment: Comment) => {
    emit('like-comment', comment)
  }
</script>