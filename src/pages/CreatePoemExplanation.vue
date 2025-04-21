<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative">
    <LoadingComponent v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-white/70" />
    <n-card 
      class="w-full max-w-2xl shadow-2xl rounded-2xl relative overflow-hidden"
      :content-style="{ padding: '16px', background: 'rgba(255,255,255,0.95)' }"
    >
      <!-- 古诗词灵感引导 -->
      <div class="flex flex-col items-center justify-center mb-6">
        <span class="text-gray-500 text-sm italic mb-2">“落霞与孤鹜齐飞，秋水共长天一色。”</span>
        <span class="text-xs text-gray-400 mb-2">—— 王勃《滕王阁序》</span>
      </div>
      <div class="flex items-center justify-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mr-4 tracking-wide">
          挥毫泼墨，留下你的独特见解
        </h1>
        <n-icon :component="PencilOutline" size="24" class="text-gray-600" />
      </div>

      <n-form>

        <n-form-item label="诗歌标题">
          <n-input
            v-model:value="formData.poemTitle"
            placeholder="请输入相关诗歌的标题（如：静夜思）"
          >
            <template #prefix>
              <n-icon :component="BookOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="诗歌作者">
          <n-input
            v-model:value="formData.poemAuthor"
            placeholder="请输入相关诗歌的作者（如：李白）"
          >
            <template #prefix>
              <n-icon :component="PersonOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="帖子标题">
          <n-input
            v-model:value="formData.title"
            placeholder="为你的解读赋予一个标题"
          >
            <template #prefix>
              <n-icon :component="TextOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="解读内容">
          <n-input
            v-model:value="formData.content"
            type="textarea"
            placeholder="分享你对诗歌的见解或感悟，亦可抒发诗心"
            :autosize="{ minRows: 3, maxRows: 8 }"
          />
        </n-form-item>

        <n-form-item label="墨香标签">
          <div class="w-full">
            <div class="flex mb-2">
              <n-auto-complete
                v-model:value="tagInput"
                :options="filteredTagOptions"
                placeholder="如：思乡、写景、咏史……"
                class="mr-2"
                :input-props="{ autocomplete: 'off' }"
                @keyup.enter="addTag"
                @select="onTagSelect"
              >
                <template #prefix>
                  <n-icon :component="PricetagOutline" />
                </template>
              </n-auto-complete>
              <AddTagsButton 
                text="添加标签"
                @click="addTag"
              />
            </div>
            <n-space>
              <n-tag 
                v-for="tag in formData.tags" 
                :key="tag.name"
                :type="tag.color as any"
                closable
                @close="removeTag(tag)"
              >
                {{ tag.name }}
              </n-tag>
            </n-space>
          </div>
        </n-form-item>

        <div class="flex justify-end space-x-2 mt-4">
          <BackButton 
            text="收笔"
            @click="cancelCreation"/>

          <SendButton 
            text="挥毫直书"
            :loading="loading"
            @click="submitExplanation" />
        </div>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  NCard, 
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NTag,
  NIcon,
  useMessage,
  NAutoComplete
} from 'naive-ui'
import { 
  PencilOutline, 
  TextOutline, 
  PricetagOutline,
  BookOutline,
  PersonOutline
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
const loading = ref(false)

// 常用标签联想列表
const tagOptions = [
  '思乡', '写景', '咏史', '抒情', '送别', '友情', '爱情', '哲理', '田园', '边塞', '怀古', '励志', '节令', '自然', '人生', '山水', '写人', '咏物', '怀人', '感怀'
]
// 计算过滤后的联想标签
const filteredTagOptions = computed(() => {
  const input = tagInput.value.trim()
  if (!input) return tagOptions
  return tagOptions.filter(option => option.includes(input) && !formData.value.tags.some(tag => tag.name === option))
})
// 选择联想标签时直接填充输入框
const onTagSelect = (val: string) => {
  tagInput.value = val
  addTag()
}

const addTag = () => {
  const trimmedTag = tagInput.value.trim()
  if (trimmedTag && !formData.value.tags.some(existingTag => existingTag.name === trimmedTag)) {
    formData.value.tags.push({
      name: trimmedTag,
      color: getRandomColor()
    })
    tagInput.value = '';
    console.log(tagInput.value);
  }
}

const removeTag = (tagToRemove: { name: string, color: string }) => {
  formData.value.tags = formData.value.tags.filter(tagItem => tagItem.name !== tagToRemove.name)
}

const submitExplanation = async () => {
  // 验证表单
  const validations = [
    { field: 'title', message: '请输入帖子标题' },
    { field: 'content', message: '请输入解读内容' }
  ]

  for (const validation of validations) {
    if (!(formData.value as any)[validation.field]) {
      message.error(validation.message)
      return
    }
  }

  loading.value = true
  try {
    const username = useAuthStore().username || ''
    const newPost = {
      title: formData.value.title,
      content: formData.value.content,
      tags: formData.value.tags.map(tagItem => tagItem.name),
      username: username,
      poemTitle: formData.value.poemTitle || '',
      poemAuthor: formData.value.poemAuthor || '',
      type: 0
    }

    await createPost(
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

  } catch (error) {
    console.error('发布失败:', error)
    message.error('发布失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const cancelCreation = () => {
  router.push({ name: 'PoemExplanationList' })
}
</script>

<style scoped>
/* 输入框获取焦点时的阴影效果 */
:deep(.n-input__state-border) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

@media (max-width: 768px) {
  .text-2xl {
    font-size: 18px;
  }
  .text-xl {
    font-size: 16px;
  }
  .text-lg {
    font-size: 14px;
  }
  .text-sm {
    font-size: 12px;
  }
  .text-xs {
    font-size: 10px;
  }
}
</style>

