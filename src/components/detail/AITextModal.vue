<template>
  <n-modal
    v-model:show="localVisible"
    class="ai-text-modal"
    preset="card"
    style="max-width: 650px; width: 90vw;"
    :title="title"
    :bordered="false"
    size="huge"
    :segmented="{ content: true, footer: 'soft' }"
    @update:show="handleUpdateShow"
  >
    <template #header-extra>
      <n-tag :bordered="false" type="success" v-if="keywords && keywords.length">
        {{ keywords.map(tag => tag.name).join('、') }}
      </n-tag>
    </template>
    
    <div v-if="isLoading" class="flex flex-col items-center justify-center p-6">
      <n-spin size="large" />
      <p class="mt-4 text-gray-600">{{ loadingText }}</p>
    </div>
    
    <div v-else-if="error" class="text-red-500 p-6">
      {{ error }}
    </div>
    
    <div class="ai-content" v-else-if="content">
      <n-scrollbar style="max-height: 60vh;">
        <div class="ai-markdown" v-html="renderedContent"></div>
      </n-scrollbar>
    </div>
    
    <div v-else class="text-center py-10">
      <n-empty description="暂无内容" />
    </div>
    
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <BackButton @click="onClose" />
        
        <div class="flex items-center gap-2">
          <CopyButton @click="copyContent" text="复制文本" />
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NModal, NScrollbar, NButton, NEmpty, NTag, NIcon, NSpin } from 'naive-ui'
import { CheckOutlined } from '@vicons/antd'
import { formatAIContent } from '@/components/functions/formatUtils'
import { marked } from 'marked'
import { showPrompt } from '../functions/prompt'

// 配置marked选项
marked.setOptions({
  breaks: true,            // 把段落中的'\n'转换为<br>
  gfm: true                // 使用GitHub风格的Markdown
})

interface Tag {
  name: string;
  color: string;
}

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    default: ''
  },
  keywords: {
    type: Array as () => Tag[],
    default: () => []
  },
  title: {
    type: String,
    default: 'AI文本生成'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '正在生成中，请稍候...'
  },
  error: {
    type: String,
    default: ''
  },
  contentType: {
    type: String,
    default: 'poem'
  }
})

const emit = defineEmits(['update:visible', 'use', 'close'])

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  localVisible.value = val
})

watch(localVisible, (val) => {
  emit('update:visible', val)
})

const handleUpdateShow = (value: boolean) => {
  emit('update:visible', value)
}

const renderedContent = computed(() => {
  if (!props.content) return ''
  // 使用formatUtils格式化内容
  const formattedContent = formatAIContent(props.content, props.contentType)
  // 使用marked将Markdown渲染为HTML
  return marked(formattedContent)
})

// 复制生成的文本
const copyContent = () => {
  if (navigator.clipboard && props.content) {
    navigator.clipboard.writeText(props.content)
      .then(() => {
        showPrompt('success', '复制成功')
      })
      .catch(err => {
        console.error('复制失败:', err)
        showPrompt('error', '复制失败')
      })
  }
}

const onUse = () => {
  emit('use', props.content)
  localVisible.value = false
}

const onClose = () => {
  emit('close')
  localVisible.value = false
}
</script>

<style scoped>
.ai-content {
  padding: 1rem 0;
}

.ai-markdown :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.75;
}

.ai-markdown {
  position: relative;
}

.ai-markdown:after {
  content: '';
  display: inline-block;
  width: 0.5em;
  height: 1em;
  background: currentColor;
  margin-left: 0.2em;
  animation: cursor-blink 1s steps(2) infinite;
  vertical-align: text-bottom;
  opacity: 0.7;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ai-markdown :deep(h1),
.ai-markdown :deep(h2),
.ai-markdown :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.ai-markdown :deep(h1) { font-size: 1.5rem; }
.ai-markdown :deep(h2) { font-size: 1.3rem; }
.ai-markdown :deep(h3) { font-size: 1.1rem; }

.ai-markdown :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 1rem;
  margin-left: 0;
  color: #6b7280;
  font-style: italic;
}

.ai-markdown :deep(ul), 
.ai-markdown :deep(ol) {
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.ai-markdown :deep(li) {
  margin-bottom: 0.25rem;
}
</style>
