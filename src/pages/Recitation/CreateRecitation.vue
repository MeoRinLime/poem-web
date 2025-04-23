<template>
  <div class="create-recitation-container">
    <div class="form-container">
      <BigTitle text="新建朗诵" class="page-title"></BigTitle>
      <div class="form-group">
        <label for="title">朗诵标题</label>
        <input 
          id="title" 
          v-model="recitationData.title" 
          type="text" 
          placeholder="请输入朗诵标题" 
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="poemId">诗歌标题</label>
        <input 
          id="poemId" 
          v-model="recitationData.poemId" 
          type="text" 
          placeholder="请输入诗歌标题" 
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="content">朗诵内容描述</label>
        <textarea 
          id="content" 
          v-model="recitationData.content" 
          placeholder="请输入朗诵内容描述" 
          class="form-textarea"
        ></textarea>
      </div>

      <div class="form-group">
        <label>朗诵音频文件</label>
        <div class="upload-container">
          <UploadFile @file-selected="handleFileSelect" />
          <p v-if="selectedFile" class="selected-file-name">
            已选择: {{ selectedFile.name }}
          </p>
        </div>
      </div>

      <div v-if="selectedFile" class="audio-preview">
        <h3>音频预览</h3>
        <audio controls>
          <source :src="audioPreviewUrl" type="audio/mpeg">
          您的浏览器不支持音频预览
        </audio>
      </div>

      <div class="button-container">
        <BackButton
          class=" mr-4"
          @click="cancelCreation">
            返回
        </BackButton>
        <SendButton 
          :disabled="isSubmitting || !isFormValid" 
          @click="submitRecitation"
        >
          {{ isSubmitting ? '上传中...' : '上传朗诵' }}
        </SendButton>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import UploadFile from '@/components/UploadFile.vue';
import { uploadRecitation } from '@/api/recitation';

const router = useRouter();
const authStore = useAuthStore();

// 确保用户已登录
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login');
  }
});

// 朗诵数据
const recitationData = ref({
  title: '',
  poemId: null as number | null,
  content: '',
});

const selectedFile = ref<File | null>(null);
const audioPreviewUrl = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');

// 检查表单是否有效
const isFormValid = computed(() => {
  return (
    recitationData.value.title.trim() !== '' &&
    recitationData.value.poemId !== null &&
    recitationData.value.content.trim() !== '' &&
    selectedFile.value !== null
  );
});

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // 检查是否为音频文件
    if (!file.type.startsWith('audio/')) {
      errorMessage.value = '请上传音频文件';
      return;
    }
    
    selectedFile.value = file;
    
    // 创建音频预览URL
    if (audioPreviewUrl.value) {
      URL.revokeObjectURL(audioPreviewUrl.value);
    }
    audioPreviewUrl.value = URL.createObjectURL(file);
    errorMessage.value = '';
  }
};

// 提交朗诵
const submitRecitation = async () => {
  if (!isFormValid.value) {
    errorMessage.value = '请填写所有必填字段';
    return;
  }

  try {
    isSubmitting.value = true;
    errorMessage.value = '';
    
    await uploadRecitation(
      selectedFile.value as File,
      recitationData.value.poemId as number,
      authStore.userId,
      authStore.username,
      recitationData.value.title,
      recitationData.value.content
    );
    
    // 上传成功后重定向到朗诵列表页面
    router.push('/recitation');
  } catch (error) {
    console.error('上传朗诵失败:', error);
    errorMessage.value = '上传失败，请稍后再试';
  } finally {
    isSubmitting.value = false;
  }
};

const cancelCreation = () => {
  router.push({ name: 'RecitationList' })
}
</script>

<style scoped>
.create-recitation-container {
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

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.selected-file-name {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.audio-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.audio-preview h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #374151;
}

.audio-preview audio {
  width: 100%;
}

.button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
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