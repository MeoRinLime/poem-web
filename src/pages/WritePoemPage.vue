<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  NForm, 
  NFormItem, 
  NInput, 
  NButton, 
  NCard, 
  NSpace,
  NGrid,
  NGridItem,
  useMessage,
  type FormRules
} from 'naive-ui'
import { 
  BookOutline as BookIcon, 
  SaveOutline as SaveIcon,
} from '@vicons/ionicons5'
import { useAuthStore } from '@/store/auth';
import { writePoem } from '@/api/writePoem'

// 诗词数据接口
interface Poem {
  title: string
  subtitle?: string
  content: string
  author: string
}

// 用户信息, 从Store中获取
const username = useAuthStore().username || 'Unknown Author'

// 诗词表单状态
const poemForm = ref({
  title: '',
  subtitle: '',
  content: ''
})

// 消息通知处理
const message = useMessage()

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
import type { FormInst } from 'naive-ui'

const formRef = ref<FormInst | null>(null)

// 提交诗词处理
const submitPoem = async () => {
  await formRef.value?.validate(async (errors: any) => {
    if (errors) {
      message.error('请检查表单内容')
      return
    }

    // 创建诗词对象
    const newPoem: Poem = {
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
    } catch (error) {
      message.error('诗词创作失败，请稍后再试')
      return
    }

    message.success('诗词创作成功！')

    // 重置表单
    poemForm.value.title = ''
    poemForm.value.subtitle = ''
    poemForm.value.content = ''
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

<template>
  <div class="min-h-screen flex items-center justify-center p-4 md:p-8">
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
          <n-form 
            ref="formRef"
            :model="poemForm"
            :rules="rules"
            label-placement="top"
            require-mark-placement="right"
          >
            <div class="space-y-4 md:space-y-6">
              <n-form-item label="标题" path="title">
                <n-input 
                  v-model:value="poemForm.title" 
                  placeholder="诗词的主题或灵感"
                  clearable
                  :maxlength="50"
                  class="poem-input"
                />
              </n-form-item>

              <n-form-item label="副标题（可选）" path="subtitle">
                <n-input 
                  v-model:value="poemForm.subtitle" 
                  placeholder="为您的诗词增添一丝微妙的意蕴"
                  clearable
                  :maxlength="30"
                  class="poem-input"
                />
              </n-form-item>

              <n-form-item label="内容" path="content">
                <n-input 
                  v-model:value="poemForm.content"
                  type="textarea"
                  placeholder="在这里倾诉您的诗意..."
                  :autosize="{
                    minRows: 5,
                    maxRows: 8
                  }"
                  :maxlength="1000"
                  show-count
                  class="poem-textarea"
                />
                <div class="text-right text-xs md:text-sm text-gray-500 mt-1">
                  剩余 {{ contentRemainingChars }} 字
                </div>
              </n-form-item>

              <n-form-item label="作者">
                <n-input 
                  v-model:value="username" 
                  disabled 
                  placeholder="登录用户名"
                  class="poem-input"
                />
              </n-form-item>

              <n-space justify="center" class="mt-4 md:mt-6">
                <n-button 
                  type="primary" 
                  @click="submitPoem"
                  secondary 
                  strong
                  size="medium"
                >
                  <template #icon>
                    <n-icon :component="SaveIcon" />
                  </template>
                  保存诗词
                </n-button>
                <n-button 
                  type="default"
                  @click="$router.push('/daily-poem')"
                  size="medium"
                >
                  <template #icon>
                    <n-icon :component="BookIcon" />
                  </template>
                  返回每日一诗
                </n-button>
              </n-space>
            </div>
          </n-form>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<style scoped>
.poem-input, .poem-textarea {
  border-bottom: 2px solid #e0e0e0;
  border-radius: 0;
  transition: border-color 0.3s ease;
}

.poem-input:hover, .poem-textarea:hover {
  border-bottom-color: #FFAB91;
}

.poem-input:focus, .poem-textarea:focus {
  border-bottom-color: #FFAB91;
  box-shadow: none;
}

@media (max-width: 767px) {
  .min-h-screen {
    padding-top: 4rem;
    padding-bottom: 1rem;
    align-items: flex-start;
  }
}
</style>