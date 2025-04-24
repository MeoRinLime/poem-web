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
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { NButton, NIcon, NSlider, NPopover, useMessage } from 'naive-ui'
  import { 
    PlayCircleOutline, 
    PauseCircleOutline,
    VolumeHighOutline,
    VolumeMediumOutline,
    VolumeLowOutline,
    VolumeOffOutline,
    DownloadOutline
  } from '@vicons/ionicons5'
  import { playRecitation } from '@/api/recitation'
  
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
    },
    recitationId: {
      type: Number,
      default: 0
    },
    usePlayApi: {
      type: Boolean,
      default: false
    }
  })
  
  const audioElement = ref<HTMLAudioElement | null>(null)
  const message = useMessage()
  
  // 播放控制状态
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(100)
  const isMuted = ref(false)
  const playbackRate = ref(1)
  
  // 音频加载状态
  const isLoading = ref(false)
  
  // 计算进度百分比
  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
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
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // 获取音频数据
  const fetchAudioData = async (recitationId: number) => {
    // 防止重复调用 - 如果已有音频或正在加载中，则不再请求
    if (isLoading.value) {
      console.log('音频加载请求正在进行中，不重复请求')
      return false
    }
    
    if (audioElement.value?.src && audioElement.value.src.startsWith('blob:')) {
      // 如果已经有了有效的音频源，不再重新加载
      return true
    }
    
    try {
      isLoading.value = true
      const audioResponse = await playRecitation(recitationId)
      if (audioResponse.code === 0 && audioResponse.data) {
        // 如果当前有Blob URL，需要释放它
        if (audioElement.value && audioElement.value.src && audioElement.value.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioElement.value.src)
        }
        
        // 设置新的音频URL（这是一个Blob URL）
        if (audioElement.value) {
          audioElement.value.src = audioResponse.data
          await audioElement.value.load()
          return true
        }
      } else {
        throw new Error(audioResponse.msg || '获取音频失败')
      }
    } catch (err: any) {
      message.error('加载音频失败: ' + err.message)
      return false
    } finally {
      isLoading.value = false
    }
    
    return false
  }
  
  // 播放/暂停切换
  const togglePlay = async () => {
    if (!audioElement.value) return
    
    if (isPlaying.value) {
      audioElement.value.pause()
      isPlaying.value = false
    } else {
      // 如果配置了使用 playRecitation API 且有朗诵ID，确保音频已加载
      if (props.usePlayApi && props.recitationId) {
        // 尝试加载音频（如果尚未加载）
        const loadSuccess = await fetchAudioData(props.recitationId)
        if (!loadSuccess) return
      }
      
      try {
        await audioElement.value.play()
        isPlaying.value = true
      } catch (err: any) {
        message.error('音频播放失败: ' + err.message)
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
    audioElement.value.muted = volumeValue === 0
    isMuted.value = volumeValue === 0
  }
  
  // 设置播放速度
  const setPlaybackRate = (rate: number) => {
    if (!audioElement.value) return
    
    playbackRate.value = rate
    audioElement.value.playbackRate = rate
  }
  
  // 进度条点击定位
  const seekAudio = (event: MouseEvent) => {
    if (!audioElement.value || duration.value === 0) return
    
    const progressBar = event.currentTarget as HTMLElement
    const rect = progressBar.getBoundingClientRect()
    const pos = (event.clientX - rect.left) / rect.width
    
    audioElement.value.currentTime = pos * duration.value
    currentTime.value = pos * duration.value
  }
  
  // 下载音频
  const downloadAudio = () => {
    if (!props.src) return
    
    const link = document.createElement('a')
    link.href = props.src
    link.download = `${props.title}-${props.author}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // 音频事件处理
  const onTimeUpdate = () => {
    if (!audioElement.value) return
    currentTime.value = audioElement.value.currentTime
  }
  
  const onLoadedMetadata = () => {
    if (!audioElement.value) return
    duration.value = audioElement.value.duration
    
    // 设置初始音量
    audioElement.value.volume = volume.value / 100
  }
  
  const onEnded = () => {
    isPlaying.value = false
    currentTime.value = 0
  }
  
  const onError = () => {
    message.error('音频加载失败，请检查链接是否有效')
  }
  
  // 生命周期钩子
  onMounted(async () => {
    // 初始化音频元素
    // 如果配置了使用 playRecitation API 且有朗诵ID，在挂载时就预加载音频
    if (props.usePlayApi && props.recitationId) {
      await fetchAudioData(props.recitationId)
    }
  })
  
  onBeforeUnmount(() => {
    // 组件销毁前暂停播放
    if (audioElement.value && !audioElement.value.paused) {
      audioElement.value.pause()
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
    transition: height 0.2s ease;
  }
  
  .progress-bar:hover {
    height: 4px;
  }
  
  .progress-fill {
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
  }
  </style>