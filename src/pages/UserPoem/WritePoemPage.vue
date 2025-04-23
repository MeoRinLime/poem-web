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
          <div class="form-container">
            <form @submit.prevent="submitPoem">
              <div class="form-group">
                <label for="title">标题</label>
                <input
                  id="title"
                  v-model="poemForm.title"
                  type="text"
                  placeholder="诗词的主题或灵感"
                  class="form-input"
                  maxlength="50"
                />
              </div>

              <div class="form-group">
                <label for="subtitle">副标题（可选）</label>
                <input
                  id="subtitle"
                  v-model="poemForm.subtitle"
                  type="text"
                  placeholder="为您的诗词增添一丝微妙的意蕴"
                  class="form-input"
                  maxlength="30"
                />
              </div>

              <div class="form-group">
                <label for="content">内容</label>
                <textarea
                  id="content"
                  v-model="poemForm.content"
                  placeholder="在这里倾诉您的诗意..."
                  class="form-textarea"
                  maxlength="1000"
                ></textarea>
                <div class="text-right text-xs md:text-sm text-gray-500 mt-1">
                  剩余 {{ contentRemainingChars }} 字
                </div>
              </div>

              <div class="form-group">
                <label for="author">作者</label>
                <input
                  id="author"
                  v-model="username"
                  type="text"
                  placeholder="登录用户名"
                  class="form-input"
                  disabled
                />
              </div>

              <div class="button-container">
                <BackButton @click="$router.push('/')"></BackButton>
                <SendButton @click="submitPoem"></SendButton>
              </div>
            </form>
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  NForm, 
  NFormItem, 
  NInput, 
  NSpace,
  NGrid,
  NGridItem,
  useMessage,
  type FormRules
} from 'naive-ui'
import { useAuthStore } from '@/store/auth';
import { writePoem } from '@/api/writePoem'
import { useRouter } from 'vue-router'
import type { WritePoem } from '@/types/poem';

const router = useRouter()

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
    } catch (error) {
      message.error('诗词创作失败，请稍后再试')
      return
    }
    message.success('诗词创作成功！')
    router.push('/user-poem-list')
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

<style scoped>
.form-container {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #FFAB91;
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
}
</style>