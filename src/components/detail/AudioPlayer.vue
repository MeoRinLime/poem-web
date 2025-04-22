<template>
    <div class="audio-player bg-white p-4 rounded-lg shadow-sm mb-4">
      <div v-if="src" class="player-container">
        <div class="player-info mb-2">
          <h3 class="text-lg font-medium text-gray-800">{{ title }} 朗读</h3>
          <p class="text-sm text-gray-600">朗读者: {{ author }}</p>
        </div>
        <audio controls :src="src" class="audio-control w-full"></audio>
      </div>
      <div v-else class="upload-container text-center py-4">
        <p class="text-gray-600 mb-2">暂无朗读，您可以上传一段朗读</p>
        <n-button type="primary" @click="triggerUpload">
          <template #icon>
            <n-icon :component="CloudUploadOutline"></n-icon>
          </template>
          上传朗读
        </n-button>
        <input 
          ref="fileInput" 
          type="file" 
          accept="audio/*" 
          style="display: none"
          @change="handleFileChange"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { NButton, NIcon, useMessage } from 'naive-ui'
  import { CloudUploadOutline } from '@vicons/ionicons5'
  
  const props = defineProps({
    src: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['upload'])
  const fileInput = ref<HTMLInputElement | null>(null)
  const message = useMessage()
  
  const triggerUpload = () => {
    fileInput.value?.click()
  }
  
  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (!input.files || input.files.length === 0) return
    
    const file = input.files[0]
    
    // 检查文件类型
    if (!file.type.startsWith('audio/')) {
      message.error('请上传音频文件')
      return
    }
    
    // 检查文件大小 (限制为20MB)
    if (file.size > 20 * 1024 * 1024) {
      message.error('文件大小不能超过20MB')
      return
    }
    
    emit('upload', file)
    
    // 重置input以允许上传相同文件
    input.value = ''
  }
  </script>