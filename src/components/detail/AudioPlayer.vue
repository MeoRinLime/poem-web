<template>
  <div class="audio-player bg-white p-4 rounded-lg shadow-sm mb-4">
    <div v-if="src" class="player-container">
      <div class="player-info mb-2">
        <h3 class="text-lg font-medium text-gray-800">{{ title }} 朗读</h3>
        <p class="text-sm text-gray-600">朗读者: {{ author }}</p>
      </div>

      <!-- 自定义音频控制界面 -->
      <div class="custom-player">
        <!-- 进度条 -->
        <div class="progress-container flex items-center mb-2">
          <span class="text-xs text-gray-500 mr-2">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar flex-1 h-2 bg-gray-200 rounded cursor-pointer" @click="seekAudio">
            <div class="progress-fill bg-primary h-full rounded" :style="{ width: `${progress}%` }"></div>
          </div>
          <span class="text-xs text-gray-500 ml-2">{{ formatTime(duration) }}</span>
        </div>

        <!-- 控制按钮 -->
        <div class="controls flex items-center justify-between">
          <div class="left-controls flex items-center">
            <!-- 播放/暂停按钮 -->
            <n-button quaternary circle @click="togglePlay">
              <n-icon size="24">
                <component :is="isPlaying ? PauseCircleOutline : PlayCircleOutline"></component>
              </n-icon>
            </n-button>

            <!-- 速度控制 -->
            <n-popover trigger="click" placement="bottom">
              <template #trigger>
                <n-button quaternary class="ml-2">
                  {{ playbackRate }}x
                </n-button>
              </template>
              <div class="rate-options">
                <div
                  v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]" :key="rate"
                  class="rate-option px-3 py-1 cursor-pointer hover:bg-gray-100"
                  :class="{ 'font-bold': playbackRate === rate }"
                  @click="setPlaybackRate(rate)">
                  {{ rate }}x
                </div>
              </div>
            </n-popover>
          </div>

          <div class="right-controls flex items-center">
            <!-- 音量控制 -->
            <div class="volume-control flex items-center">
              <n-button quaternary circle @click="toggleMute">
                <n-icon size="20">
                  <component :is="volumeIcon"></component>
                </n-icon>
              </n-button>
              <div class="volume-slider w-20 mx-2">
                <n-slider v-model:value="volume" :step="1" :tooltip="false" @update:value="updateVolume" />
              </div>
            </div>

            <!-- 下载按钮 -->
            <n-button quaternary circle title="下载音频" @click="downloadAudio">
              <n-icon size="20">
                <DownloadOutline />
              </n-icon>
            </n-button>
          </div>
        </div>
      </div>

      <!-- 隐藏的原生audio元素用于控制 -->
      <audio
        ref="audioElement"
        :src="src"
        preload="metadata"
        style="display: none;"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @ended="onEnded"
        @error="onError">
      </audio>
    </div>
    <div v-else class="no-audio-message text-center py-4">
      <p class="text-gray-600 mb-2">暂无朗读音频</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue' // 引入 watch
import { NButton, NIcon, NSlider, NPopover } from 'naive-ui'
import {
  PlayCircleOutline,
  PauseCircleOutline,
  VolumeHighOutline,
  VolumeMediumOutline,
  VolumeLowOutline,
  VolumeOffOutline,
  DownloadOutline
} from '@vicons/ionicons5'
import { showPrompt } from '@/components/functions/prompt'

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

const audioElement = ref<HTMLAudioElement | null>(null)

// 播放控制状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(100) // 保持 0-100 范围用于 slider
const isMuted = ref(false)
const playbackRate = ref(1)

// 计算进度百分比
const progress = computed(() => {
  if (duration.value > 0) {
    return (currentTime.value / duration.value) * 100
  }
  return 0
})

// 计算音量图标
const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return VolumeOffOutline
  if (volume.value < 30) return VolumeLowOutline
  if (volume.value < 70) return VolumeMediumOutline
  return VolumeHighOutline
})

// 格式化时间为分:秒格式
const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds === Infinity) return '0:00' // 处理 Infinity
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 播放/暂停切换
const togglePlay = async () => {
  if (!audioElement.value) return

  if (isPlaying.value) {
    audioElement.value.pause()
    isPlaying.value = false
  } else {
    // 直接尝试播放，浏览器会处理加载
    try {
      // 如果 src 为空，则不播放
      if (!props.src) {
          showPrompt('warning','没有可播放的音频源');
          return;
      }
      // 确保音频元素有 src
      if (audioElement.value.src !== props.src) {
          audioElement.value.src = props.src;
          // 等待元数据加载完成，以便获取正确的 duration
          audioElement.value.load(); // 显式调用 load 可能有助于某些情况
      }
      await audioElement.value.play()
      isPlaying.value = true
    } catch (error: any) {
      console.error('音频播放错误:', error);
      // 检查是否是 AbortError (用户快速切换导致)
      if (error.name === 'NotAllowedError') {
        showPrompt('error','浏览器禁止自动播放，请手动点击播放');
      } else if (error.name !== 'AbortError') {
        showPrompt('error','音频播放失败: ' + error.message);
      }
      isPlaying.value = false // 确保状态正确
    }
  }
}

// 静音切换
const toggleMute = () => {
  if (!audioElement.value) return
  audioElement.value.muted = !audioElement.value.muted
  isMuted.value = audioElement.value.muted
}

// 更新音量
const updateVolume = (val: number) => {
  if (!audioElement.value) return
  const volumeValue = val / 100
  audioElement.value.volume = volumeValue
  // 如果音量大于0，取消静音状态
  if (volumeValue > 0 && isMuted.value) {
      audioElement.value.muted = false;
      isMuted.value = false;
  } else if (volumeValue === 0) {
      audioElement.value.muted = true;
      isMuted.value = true;
  }
}

// 设置播放速度
const setPlaybackRate = (rate: number) => {
  if (!audioElement.value) return
  playbackRate.value = rate
  audioElement.value.playbackRate = rate
}

// 进度条点击定位
const seekAudio = (event: MouseEvent) => {
  if (!audioElement.value || duration.value === 0 || !isFinite(duration.value)) return // 增加 duration 有效性检查

  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  const newTime = pos * duration.value

  audioElement.value.currentTime = newTime
  // 立即更新 currentTime 以提供即时反馈
  currentTime.value = newTime
}

// 下载音频
const downloadAudio = () => {
  if (!props.src) {
    showPrompt('warning','没有可下载的音频源');
    return;
  }

  const link = document.createElement('a')
  link.href = props.src
  // 尝试从 URL 获取文件名，否则使用默认名
  let defaultFilename = `${props.title}-${props.author}.mp3`;
  try {
      const url = new URL(props.src);
      const pathSegments = url.pathname.split('/');
      const filenameFromUrl = pathSegments.pop();
      if (filenameFromUrl) {
          defaultFilename = filenameFromUrl;
      }
  } catch (error) {
      // 如果 src 不是有效 URL，则忽略错误，使用默认文件名
      console.warn("无法从 src 解析文件名:", error);
  }
  link.download = defaultFilename;
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 音频事件处理
const onTimeUpdate = () => {
  if (!audioElement.value) return
  // 只有在播放时才更新 currentTime，避免暂停时因精度问题跳动
  if (isPlaying.value) {
      currentTime.value = audioElement.value.currentTime
  }
}

const onLoadedMetadata = () => {
  if (!audioElement.value) return
  // 确保获取到有效的 duration
  if (isFinite(audioElement.value.duration)) {
      duration.value = audioElement.value.duration
  } else {
      duration.value = 0; // 处理无效或无限时长
      console.warn("音频元数据加载完成，但时长无效:", audioElement.value.duration);
  }
  // 设置初始音量和播放速率
  audioElement.value.volume = volume.value / 100
  audioElement.value.playbackRate = playbackRate.value
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = duration.value // 播放结束时，将当前时间设置为总时长
}

const onError = (event: Event) => {
    console.error('音频元素错误:', event);
    let errorMsg = '音频加载或播放时发生未知错误';
    if (audioElement.value?.error) {
        switch (audioElement.value.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                errorMsg = '音频加载被中止';
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                errorMsg = '网络错误导致音频加载失败';
                break;
            case MediaError.MEDIA_ERR_DECODE:
                errorMsg = '音频解码错误';
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMsg = '音频格式不支持或链接无效';
                break;
            default:
                errorMsg = `发生未知错误，代码: ${audioElement.value.error.code}`;
        }
    }
    showPrompt('error',errorMsg);
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = 0; // 重置时长
}

// 监听 src prop 的变化
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc && audioElement.value) {
    console.log('音频源变化:', newSrc);
    // 停止当前播放（如果正在播放）
    if (isPlaying.value) {
      audioElement.value.pause();
      isPlaying.value = false;
    }
    // 重置状态
    currentTime.value = 0;
    duration.value = 0;
    // progress.value = 0; // progress 是 computed 属性，不需要手动设置

    if (newSrc) {
      audioElement.value.src = newSrc;
      audioElement.value.load(); // 重新加载新的音频源
      console.log('开始加载新音频:', newSrc);
    } else {
      // 如果新 src 为空，则清空 audio 元素的 src
      audioElement.value.removeAttribute('src');
      console.log('音频源已清除');
    }
  }
});


onMounted(() => {
  if (audioElement.value && props.src) {
      audioElement.value.load(); // 确保元数据加载，设置 duration
  }
})

onBeforeUnmount(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    // 手动移除监听器以防万一
    audioElement.value.removeEventListener('timeupdate', onTimeUpdate);
    audioElement.value.removeEventListener('loadedmetadata', onLoadedMetadata);
    audioElement.value.removeEventListener('ended', onEnded);
    audioElement.value.removeEventListener('error', onError);
  }
})

</script>

<style scoped>
.custom-player {
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  position: relative;
}

.progress-fill {
  /* 保持平滑过渡 */
  background-color: #18a058;
  transition: width 0.1s linear;
}

.volume-control {
  position: relative;
}

.rate-option {
  transition: background-color 0.2s ease;
}

.rate-option.font-bold {
  color: var(--primary-color);
  color: #18a058;
}
</style>