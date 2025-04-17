<template>
  <div class="upload-container">
    <h3>上传朗读文件</h3>
    
    <div class="form-group">
      <label for="file-upload">选择音频文件:</label>
      <input 
        type="file" 
        id="file-upload" 
        accept="audio/*" 
        @change="handleFileChange"
        ref="fileInput"
      />
      <div v-if="selectedFile" class="file-info">
        已选择: {{ selectedFile.name }}
      </div>
    </div>
    
    <div class="form-group">
      <label for="title">标题:</label>
      <input type="text" id="title" v-model="title" />
    </div>
    
    <div class="form-group">
      <label for="content">内容:</label>
      <textarea id="content" v-model="content"></textarea>
    </div>
    
    <div class="poem-info">
      <h4>诗词信息:</h4>
      <p>诗词ID: {{ poemId }}</p>
      <p>作者ID: {{ authorId }}</p>
      <p>作者: {{ authorName }}</p>
    </div>
    
    <div class="actions">
      <button @click="upload" :disabled="isUploading">
        {{ isUploading ? '上传中...' : '上传' }}
      </button>
      <button @click="resetForm" :disabled="isUploading">重置</button>
    </div>
    
    <div v-if="uploadStatus" :class="['status', uploadStatus.type]">
      {{ uploadStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { uploadRecitation } from '@/api/recitation'; 

// 表单数据
const poemId = ref(1); // 假设这些值会由父组件传入或从其他地方获取
const authorId = ref(101);
const authorName = ref('李白');
const title = ref('');
const content = ref('');
const selectedFile = ref(null);
const fileInput = ref(null);
const isUploading = ref(false);
const uploadStatus = ref(null);

// 文件选择处理
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // 可以在这里添加文件类型检查或大小限制
    uploadStatus.value = null; // 清除之前的状态
  }
};

// 上传处理
const upload = async () => {
  if (!selectedFile.value) {
    uploadStatus.value = {
      type: 'error',
      message: '请先选择一个文件'
    };
    return;
  }
  
  if (!title.value.trim()) {
    uploadStatus.value = {
      type: 'error',
      message: '请输入标题'
    };
    return;
  }
  
  try {
    isUploading.value = true;
    uploadStatus.value = {
      type: 'info',
      message: '正在上传...'
    };
    
    const result = await uploadRecitation(
      selectedFile.value,
      poemId.value,
      authorId.value,
      authorName.value,
      title.value,
      content.value
    );
    
    uploadStatus.value = {
      type: 'success',
      message: '上传成功!'
    };
    
    // 可以在这里处理成功后的逻辑，比如显示上传结果
    console.log('上传结果:', result);
    
  } catch (error) {
    uploadStatus.value = {
      type: 'error',
      message: `上传失败: ${error.message || '未知错误'}`
    };
  } finally {
    isUploading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  selectedFile.value = null;
  title.value = '';
  content.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  uploadStatus.value = null;
};
</script>

<style scoped>
.upload-container {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"], textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

textarea {
  height: 100px;
}

.file-info {
  margin-top: 5px;
  font-size: 0.9em;
  color: #666;
}

.poem-info {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.poem-info h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:last-child {
  background-color: #f44336;
}

.status {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.status.success {
  background-color: #d4edda;
  color: #155724;
}

.status.error {
  background-color: #f8d7da;
  color: #721c24;
}

.status.info {
  background-color: #d1ecf1;
  color: #0c5460;
}
</style>