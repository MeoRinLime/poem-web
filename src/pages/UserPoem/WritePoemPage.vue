<template>
  <div class="min-h-screen flex items-center justify-center p-4 mt-12 md:p-8">
    <div class="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
      <n-grid 
        :cols="isMobile ? 1 : 2" 
        :x-gap="0" 
        :y-gap="0"
        class="h-auto md:h-[700px]"
      >
        <!-- 左侧装饰区域 -->
        <n-grid-item 
          class="bg-cover bg-center relative" 
          style="background-image: linear-gradient(120deg,#FFAB91 0%,#FFAB91 100%), 
          url('/assets/images/poem-bg.jpg')"
          :class="isMobile ? 'h-40' : 'h-full'"
        >
          <div class="absolute inset-0 flex flex-col justify-center p-4 md:p-8 text-white" style="font-family: Courier New, Courier, monospace">
            <h2 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4">诗词创作</h2>
            <p class="text-sm md:text-lg opacity-80">
              让文字如诗，情感如歌。<br>
              在这里，每一个词都是诗的开始。
            </p>
          </div>
        </n-grid-item>

        <!-- 右侧表单区域 -->
        <n-grid-item class="bg-white p-4 md:p-8 overflow-y-auto">
          <div class="form-container">
            <n-form
              ref="formRef"
              :model="poemForm"
              :rules="rules"
              class="custom-form"
            >
              <n-form-item label="标题" path="title" class="custom-form-item">
                <n-input
                  v-model:value="poemForm.title"
                  placeholder="诗词的主题或灵感"
                  maxlength="50"
                  class="custom-input"
                />
              </n-form-item>

              <n-form-item label="副标题（可选）" path="subtitle" class="custom-form-item">
                <n-input
                  v-model:value="poemForm.subtitle"
                  placeholder="为您的诗词增添一丝微妙的意蕴"
                  maxlength="30"
                  class="custom-input"
                />
              </n-form-item>
              <n-form-item label="AI灵思 (输入意向或关键词)" class="custom-form-item">
                <div class="tags-container">
                  <div class="tags-display">
                    <n-tag
                      v-for="(tag, index) in aiKeywords"
                      :key="index"
                      :style="{ backgroundColor: tag.color }"
                      :bordered="false"
                      @close="removeTag(index)"
                      closable
                      class="tag"
                    >
                      {{ tag.name }}
                    </n-tag>
                  </div>
                  <div class="tags-input">
                    <n-input
                      v-model:value="aiPrompt"
                      placeholder="输入创作灵感关键词，如：思乡、月光、秋风..."
                      class="custom-input"
                      @keydown.enter.prevent="addTag"
                    />
                  </div>
                  <div class="ai-button-container">
                    <AddTagsButton text="添加" @click="addTag" class="mr-6 rounded-2xl" />
                    <AIButton 
                      :loading="aiLoading" 
                      :disabled="aiKeywords.length === 0" 
                      text="生成诗词灵感" 
                      @click="handleAIGenerate"
                    />
                  </div>
                </div>
              </n-form-item>
              <n-form-item label="内容" path="content" class="custom-form-item">
                <n-input
                  v-model:value="poemForm.content"
                  placeholder="在这里倾诉您的诗意..."
                  type="textarea"
                  :autosize="{
                    minRows: 5,
                    maxRows: 10
                  }"
                  maxlength="1000"
                  class="custom-textarea"
                />
                <div class="text-right text-xs md:text-sm text-gray-500 mt-1">
                  剩余 {{ contentRemainingChars }} 字
                </div>
              </n-form-item>

              <n-form-item label="作者" class="custom-form-item">
                <n-input
                  v-model:value="username"
                  placeholder="登录用户名"
                  disabled
                  class="custom-input"
                />
              </n-form-item>

              <div class="button-container">
                <BackButton @click="$router.push('/')"></BackButton>
                <SendButton @click="handleSubmit"></SendButton>
              </div>
            </n-form>
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
  
  <!-- AI生成诗歌展示模态框 -->
  <AITextModal 
    v-model:visible="showGenerateModal" 
    :content="aiGenerated"
    :keywords="aiKeywords"
    :is-loading="aiLoading"
    loading-text="正在分析诗歌，请稍候..."
    :error="generateError ? '服务器繁忙，请稍后再试' : ''"
    title="AI灵思诗作"
    content-type="poem"
    @use="useGeneratedPoem"
    @close="closeGenerateModal"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  NGrid,
  NGridItem,
  NForm,
  NFormItem,
  NInput,
  NTag,
  type FormRules,
  type FormInst
} from 'naive-ui'
import { useAuthStore } from '@/store/auth';
import { writePoem } from '@/api/writePoem'
import { generatePoem } from '@/api/deepseek'
import { useRouter } from 'vue-router'
import type { WritePoem } from '@/types/poem';

import { showPrompt } from '@/components/functions/prompt'

const router = useRouter()

// 用户信息, 从Store中获取
const username = useAuthStore().username || 'Unknown Author'

// 诗词表单状态
const poemForm = ref({
  title: '',
  subtitle: '',
  content: ''
})

// AI相关状态
const aiPrompt = ref('')
const aiLoading = ref(false)
const aiGenerated = ref('')
const showGenerateModal = ref(false)
const stopGeneration = ref<null | (() => void)>(null)
const generateError = ref('')

// 关键词标签相关
interface Tag {
  name: string;
  color: string;
}

const aiKeywords = ref<Tag[]>([])
const tagColors = ['#67c23a', '#e6a23c', '#f56c6c', '#409eff', '#909399']

// 添加标签
const addTag = () => {
  const value = aiPrompt.value.trim()
  if (!value) return
  
  // 检查是否已存在相同标签
  if (aiKeywords.value.some(tag => tag.name === value)) {
    showPrompt('warning', '该关键词已添加')
    aiPrompt.value = ''
    return
  }
  
  // 添加新标签
  aiKeywords.value.push({
    name: value,
    color: tagColors[Math.floor(Math.random() * tagColors.length)]
  })
  
  aiPrompt.value = ''
}

// 移除标签
const removeTag = (index: number) => {
  aiKeywords.value.splice(index, 1)
}

// 处理AI生成功能
const handleAIGenerate = () => {
  if (aiKeywords.value.length === 0) {
    showPrompt('warning', '请添加至少一个创作灵感关键词')
    return
  }
  
  // 重置生成内容并立即显示模态框
  aiGenerated.value = ''
  showGenerateModal.value = true
  aiLoading.value = true
  
  // 如果有正在进行的生成，先停止
  if (stopGeneration.value) {
    stopGeneration.value()
    stopGeneration.value = null
  }
  
  // 构建提示词
  const prompt = `${aiKeywords.value.map(tag => tag.name).join('、')}`
  let generatedText = ''
  
  // 调用AI生成接口
  stopGeneration.value = generatePoem(
    prompt,
    // 每次收到消息的回调
    (text) => {
      generatedText += text
      aiGenerated.value = generatedText
    },
    // 错误处理
    () => {
      aiLoading.value = false
      generateError.value = '分析过程中发生错误，请稍后重试'
      showPrompt('error', '服务器繁忙，请稍后再试')
    },
    // 完成回调
    () => {
      aiLoading.value = false
      stopGeneration.value = null
    }
  )
}

// 使用生成的诗歌（保留此函数来与模态框保持兼容）
const useGeneratedPoem = (content: string) => {
  poemForm.value.content = content
  showGenerateModal.value = false
}

// 关闭生成模态框
const closeGenerateModal = () => {
  showGenerateModal.value = false
  // 如果还在生成中，停止生成
  if (aiLoading.value && stopGeneration.value) {
    stopGeneration.value()
    stopGeneration.value = null
    aiLoading.value = false
  }
}

// 表单验证规则
const rules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入诗词标题',
      trigger: ['input', 'blur']
    },
    {
      max: 50,
      message: '标题不能超过50个字',
      trigger: ['input', 'blur']
    }
  ],
  subtitle: [
    {
      max: 30,
      message: '副标题不能超过30个字',
      trigger: ['input', 'blur']
    }
  ],
  content: [
    {
      required: true,
      message: '请输入诗词内容',
      trigger: ['input', 'blur']
    },
    {
      min: 10,
      message: '诗词内容至少需要10个字',
      trigger: ['input', 'blur']
    }
  ]
}

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单提交处理
const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) {
      showPrompt('error', '请检查表单内容')
      return
    }

    // 创建诗词对象
    const newPoem: WritePoem = {
      title: poemForm.value.title,
      subtitle: poemForm.value.subtitle || undefined,
      content: poemForm.value.content,
      author: username
    }

    try {
      await writePoem(
        newPoem.title, 
        newPoem.author,
        newPoem.content,
        newPoem.subtitle,
      )
      showPrompt('success', '诗词创作成功！')
      router.push('/user-poem-list')
      // 重置表单
      poemForm.value.title = ''
      poemForm.value.subtitle = ''
      poemForm.value.content = ''
    } catch (error) {
      showPrompt('error', '诗词创作失败，请稍后再试')
    }
  })
}

// 计算内容剩余字符
const contentRemainingChars = computed(() => {
  return 1000 - (poemForm.value.content?.length || 0)
})

// 响应式布局控制
const isMobile = ref(false)

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}
</script>

<style scoped>
.form-container {
  width: 100%;
}

/* 标签容器样式 */
.tags-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  min-height: 32px;
  padding: 0.25rem 0;
}

.tag {
  color: white;
  font-weight: 500;
}

.tags-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.tags-input .custom-input {
  flex-grow: 1;
}

/* AI按钮容器 */
.ai-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

/* 自定义AddTagsButton样式 */
.tags-container :deep(.Btn) {
  width: 100px;
  height: 36px;
  background-color: #FFAB91;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tags-container :deep(.Btn:hover) {
  background-color: #FF8A65;
}

.tags-container :deep(.Btn) .svgIcon path {
  fill: white;
}

/* AI按钮禁用状态 */
.ai-button-container :deep(.n-button--disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 自定义 Naive UI 表单样式 */
.custom-form :deep(.n-form-item-label) {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  padding: 0;
  height: auto;
  font-size: inherit;
}

.custom-form :deep(.n-form-item) {
  margin-bottom: 1.5rem;
  grid-template-columns: 100% !important;
  grid-template-areas: 
    "label"
    "blank"
    "feedback";
}

.custom-form :deep(.n-form-item-feedback-wrapper) {
  min-height: auto;
}

.custom-form :deep(.n-input) {
  border-radius: 8px;
  transition: border-color 0.3s;
}

.custom-form :deep(.n-input__input) {
  padding: 0.75rem;
  font-size: 1rem;
}

.custom-form :deep(.n-input__textarea) {
  min-height: 150px;
  padding: 0.75rem;
  font-size: 1rem;
}

.custom-form :deep(.n-input--focused) {
  border-color: #FFAB91;
}

.custom-form :deep(.n-input:focus-within) {
  border-color: #FFAB91;
  box-shadow: none;
}

.button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 767px) {
  .min-h-screen {
    padding-top: 4rem;
    padding-bottom: 1rem;
    align-items: flex-start;
  }
  
  .ai-input-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ai-input-container button {
    margin-top: 0.5rem;
  }
}
</style>