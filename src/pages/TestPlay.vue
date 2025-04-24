<template>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <hr>
  <div>
    <audio ref="audioPlayer" controls></audio>
    <button @click="playAudio(5)">获取音频</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, type Ref } from 'vue';
import axios, { type AxiosError } from 'axios';

// 定义组件接收的props类型
interface Props {
  recitationId: number;
}
defineProps<Props>();

// 音频元素引用（明确DOM元素类型）
const audioPlayer: Ref<HTMLAudioElement | null> = ref(null);
// 临时URL存储（严格null类型控制）
const currentAudioUrl: Ref<string | null> = ref(null);

// 播放音频方法（明确参数类型）
const playAudio = async (recitationId: number): Promise<void> => {
  try {
    // 1. 发起请求获取音频流（明确响应数据类型）
    const response = await axios.get<Blob>(`http://localhost:8000/api/recitation/play`,{
      responseType: 'blob',
      params:{
          recitationId
      }
    });

    // 2. 释放旧URL资源
    if (currentAudioUrl.value) {
      URL.revokeObjectURL(currentAudioUrl.value);
      currentAudioUrl.value = null;
    }

    // 3. 创建新Blob URL（严格类型检查）
    const blob = new Blob([response.data], { type: 'audio/mpeg' });
    currentAudioUrl.value = URL.createObjectURL(blob);

    // 4. 安全操作DOM元素（非空断言）
    if (audioPlayer.value && currentAudioUrl.value) {
      audioPlayer.value.src = currentAudioUrl.value;
      // 处理自动播放策略
      audioPlayer.value.play().catch((error: DOMException) => {
        console.error('播放被阻止:', error.name);
        // 可以在此处显示播放按钮让用户手动触发
      });
    }
  } catch (error) {
    // 类型安全的错误处理
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      alert('音频资源不存在');
    } else {
      alert('音频加载失败，请稍后重试');
    }
    console.error('播放失败:', axiosError);
  }
};

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (currentAudioUrl.value) {
    URL.revokeObjectURL(currentAudioUrl.value);
    currentAudioUrl.value = null;
  }
});
</script>