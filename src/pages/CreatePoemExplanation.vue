<template>
  <div class="create-explanation-container">
    <div class="form-container">
      <div class="form-group">
        <BigTitle 
        text= "新建诗歌解读贴"
        class="page-title" />
        <label for="poemTitle">诗歌标题</label>
        <input 
          id="poemTitle" 
          v-model="formData.poemTitle" 
          type="text" 
          placeholder="请输入相关诗歌的标题（如：静夜思）" 
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="poemAuthor">诗歌作者</label>
        <input 
          id="poemAuthor" 
          v-model="formData.poemAuthor" 
          type="text" 
          placeholder="请输入相关诗歌的作者（如：李白）" 
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="title">帖子标题</label>
        <input 
          id="title" 
          v-model="formData.title" 
          type="text" 
          placeholder="为你的解读赋予一个标题" 
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="content">解读内容</label>
        <textarea 
          id="content" 
          v-model="formData.content" 
          placeholder="分享你对诗歌的见解或感悟，亦可抒发诗心" 
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="tags">墨香标签</label>
        <div class="tags-input-container">
          <input 
            id="tags" 
            v-model="tagInput" 
            type="text" 
            placeholder="如：思乡、写景、咏史……" 
            class="form-input"
            list="tag-suggestions"
            @keyup.enter="addTag"
          />
          <datalist id="tag-suggestions">
            <option v-for="option in tagOptions" :key="option" :value="option"></option>
          </datalist>
          <AddTagsButton 
            @click="addTag" 
          >
            添加
          </AddTagsButton>
        </div>
        <div v-if="formData.tags.length > 0" class="tags-container">
          <span 
            v-for="tag in formData.tags" 
            :key="tag.name"
            class="tag-item"
            :style="{ backgroundColor: getTagColorStyle(tag.color) }"
          >
            {{ tag.name }}
            <span class="tag-close" @click="removeTag(tag)">×</span>
          </span>
        </div>
      </div>

      <div class="button-container">
        <BackButton 
          @click="cancelCreation" 
        >
          收笔
        </BackButton>
        <SendButton 
          :disabled="loading || !isFormValid" 
          @click="submitExplanation"
        >
          {{ loading ? '提交中...' : '挥毫直书' }}
        </SendButton>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BackButton from '@/components/buttons/BackButton.vue'
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

// 标签颜色转换
const getTagColorStyle = (colorType: string) => {
  const colorMap = {
    'success': '#18a058',
    'warning': '#f0a020',
    'error': '#d03050',
    'info': '#2080f0',
    'default': '#d9d9d9'
  }
  return colorMap[colorType] || '#d9d9d9'
}

// 常用标签联想列表
const tagOptions = [
  '思乡', '写景', '咏史', '抒情', '送别', '友情', '爱情', '哲理', '田园', '边塞', 
  '怀古', '励志', '节令', '自然', '人生', '山水', '写人', '咏物', '怀人', '感怀'
]

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
const loading = ref(false)
const errorMessage = ref('')

// 检查表单是否有效
const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' && 
         formData.value.content.trim() !== '';
})

const addTag = () => {
  const trimmedTag = tagInput.value.trim()
  if (trimmedTag && !formData.value.tags.some(tag => tag.name === trimmedTag)) {
    formData.value.tags.push({
      name: trimmedTag,
      color: getRandomColor()
    })
    tagInput.value = ''
  }
}

const removeTag = (tagToRemove: { name: string, color: string }) => {
  formData.value.tags = formData.value.tags.filter(tag => tag.name !== tagToRemove.name)
}

const submitExplanation = async () => {
  if (!isFormValid.value) {
    errorMessage.value = '请填写标题和内容';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const username = useAuthStore().username || ''
    const newPost = {
      title: formData.value.title,
      content: formData.value.content,
      tags: formData.value.tags.map(tag => tag.name),
      username: username,
      poemTitle: formData.value.poemTitle || '',
      poemAuthor: formData.value.poemAuthor || '',
      type: 1
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

    // 返回列表页
    router.push({ name: 'PoemExplanationList' })
  } catch (error) {
    console.error('发布失败:', error);
    errorMessage.value = '发布失败，请稍后再试';
  } finally {
    loading.value = false;
  }
}

const cancelCreation = () => {
  router.push({ name: 'PoemExplanationList' })
}
</script>

<style scoped>
.create-explanation-container {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 2rem;
  padding: 2rem;
}

.page-title {
  margin-left: 1rem;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
  border-color: #6366f1;
}

.tags-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.9rem;
  color: white;
}

.tag-close {
  margin-left: 0.3rem;
  cursor: pointer;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button:disabled {
  background-color: #a5a6f6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  color: #ef4444;
  text-align: center;
}
</style>

