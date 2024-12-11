<!-- eslint-disable id-length -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  NCard, 
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NTag,
  NIcon,
  useMessage
} from 'naive-ui'
import { 
  PencilOutline, 
  PersonOutline, 
  BookmarkOutline, 
  TextOutline, 
  PricetagOutline,
  AddOutline,
  CloseOutline
} from '@vicons/ionicons5'
import router from '@/router'
import { useAuthStore } from '@/store/auth'
import { createPost } from '@/api/post'

// 随机颜色生成器
const tagColors = [
  'success', 'warning', 'error', 'info', 'default'
]

const getRandomColor = () => {
  return tagColors[Math.floor(Math.random() * tagColors.length)]
}

// 新增解释帖子的表单数据
interface FormData {
  poemTitle: string;
  poemAuthor: string;
  title: string;
  content: string;
  tags: { name: string, color: string }[];
}

const formData = ref<FormData>({
  poemTitle: '',
  poemAuthor: '',
  title: '',
  content: '',
  tags: []
})

const tagInput = ref('')
const message = useMessage()

const addTag = () => {
  const trimmedTag = tagInput.value.trim()
  if (trimmedTag && !formData.value.tags.some(t => t.name === trimmedTag)) {
    formData.value.tags.push({
      name: trimmedTag,
      color: getRandomColor()
    })
    tagInput.value = ''
  }
}

const removeTag = (tagToRemove: { name: string, color: string }) => {
  formData.value.tags = formData.value.tags.filter(t => t.name !== tagToRemove.name)
}

const submitExplanation = () => {
  // 验证表单
  const validations = [
    { field: 'poemTitle', message: '请输入诗歌标题' },
    { field: 'poemAuthor', message: '请输入诗人' },
    { field: 'title', message: '请输入标题' },
    { field: 'content', message: '请输入内容' }
  ]

  for (const validation of validations) {
    if (!formData.value[validation.field]) {
      message.error(validation.message)
      return
    }
  }

  const username = useAuthStore().username || ''
  const newPost = {
    title: formData.value.title,
    content: formData.value.content,
    tags: formData.value.tags.map(t => t.name),
    username: username,
    poemTitle: formData.value.poemTitle,
    poemAuthor: formData.value.poemAuthor,
    type: 1
  }
  createPost(
    newPost.title,
    newPost.username,
    newPost.poemTitle,
    newPost.poemAuthor,
    newPost.content,
    newPost.type,
    newPost.tags,
  );

  message.success('发布成功！')
  
  // 返回列表页
  router.push({ name: 'PoemExplanationList' })
}

const cancelCreation = () => {
  router.push({ name: 'PoemExplanationList' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-24">
    <n-card 
      class="w-full max-w-2xl shadow-2xl rounded-2xl"
      :content-style="{ padding: '32px' }"
    >
      <div class="flex items-center justify-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mr-4">
          撰写新诗词解析
        </h1>
        <n-icon :component="PencilOutline" size="28" class="text-gray-600" />
      </div>

      <n-form>
        <n-form-item label="诗歌标题">
          <n-input 
            v-model:value="formData.poemTitle"
            placeholder="请输入诗歌标题"
          >
            <template #prefix>
              <n-icon :component="BookmarkOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="诗人">
          <n-input 
            v-model:value="formData.poemAuthor"
            placeholder="请输入诗人名字"
          >
            <template #prefix>
              <n-icon :component="PersonOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="标题">
          <n-input 
            v-model:value="formData.title"
            placeholder="给你的解析起一个吸引人的标题"
          >
            <template #prefix>
              <n-icon :component="TextOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="内容">
          <n-input 
            v-model:value="formData.content"
            type="textarea"
            placeholder="你对这首诗的理解..."
            :autosize="{ minRows: 4, maxRows: 10 }"
          />
        </n-form-item>

        <n-form-item label="标签">
          <div class="w-full">
            <div class="flex mb-2">
              <n-input 
                v-model:value="tagInput"
                placeholder="输入标签"
                class="mr-2"
                @keyup.enter="addTag"
              >
                <template #prefix>
                  <n-icon :component="PricetagOutline" />
                </template>
              </n-input>
              <n-button 
                type="primary" 
                @click="addTag"
                class="flex items-center"
              >
                <n-icon :component="AddOutline" class="mr-1" />
                添加
              </n-button>
            </div>
            <n-space>
              <n-tag 
                v-for="tag in formData.tags" 
                :key="tag.name"
                :type="tag.color"
                closable
                @close="removeTag(tag)"
              >
                {{ tag.name }}
              </n-tag>
            </n-space>
          </div>
        </n-form-item>

        <div class="flex justify-end space-x-4 mt-6">
          <n-button 
            @click="cancelCreation"
            class="mr-2"
          >
            <template #icon>
              <n-icon :component="CloseOutline" />
            </template>
            取消
          </n-button>
          <n-button 
            type="primary" 
            @click="submitExplanation"
          >
            发布
          </n-button>
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
/* 输入框获取焦点时的阴影效果 */
:deep(.n-input__state-border) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>