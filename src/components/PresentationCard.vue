<template>
  <div class="task bg-white dark:bg-gray-800" draggable="true">
    <div class="task-header">
      <h3 class="title text-gray-900 dark:text-gray-100">{{ title }}</h3>
      <p class="subtitle dark:text-gray-400">{{ subTitle }}</p>
    </div>
    
    <div class="tags-container">
      <div class="tags-list">
        <span 
          v-for="(tag, index) in tags" 
          :key="index" 
          class="tag"
          :style="tagStyles[index % tagStyles.length]"
        >
          {{ tag }}
        </span>
      </div>
      <button class="options dark:hover:bg-gray-700">
        <svg id="Capa_1" xml:space="preserve" viewBox="0 0 41.915 41.916" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" :fill="isDarkMode ? '#9fa4aa' : '#000000'"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linejoin="round" stroke-linecap="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path> <path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path> <path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path> </g> </g> </g></svg>
      </button>
    </div>
    
    <p class="content dark:text-gray-300">{{ truncatedContent }}</p>
    
    <div class="stats dark:border-gray-700">
      <div class="action-stats">
        <div class="stat-item dark:text-gray-400 dark:hover:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="dark:stroke-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 11l5-5 5 5M7 13l5 5 5-5"/>
          </svg>
          {{ likes }}
        </div>
        <div class="stat-item dark:text-gray-400 dark:hover:text-blue-400">
          <svg id="SVGRepo_tracerCarrier" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="dark:stroke-gray-400"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g stroke-linejoin="round" stroke-linecap="round"></g><g id="SVGRepo_iconCarrier"> <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" d="M3 10C3 4.64706 5.11765 3 12 3C18.8824 3 21 4.64706 21 10C21 15.3529 18.8824 17 12 17C11.6592 17 11.3301 16.996 11.0124 16.9876L7 21V16.4939C4.0328 15.6692 3 13.7383 3 10Z"></path> </g></svg>
          {{ comments }}
        </div>
        <div class="stat-item dark:text-gray-400 dark:hover:text-blue-400">
          <svg id="SVGRepo_tracerCarrier" :fill="isDarkMode ? '#9fa4aa' : '#000000'" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-2.5 0 32 32"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g stroke-linejoin="round" stroke-linecap="round" ></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M0 10.284l0.505 0.36c0.089 0.064 0.92 0.621 2.604 0.621 0.27 0 0.55-0.015 0.836-0.044 3.752 4.346 6.411 7.472 7.060 8.299-1.227 2.735-1.42 5.808-0.537 8.686l0.256 0.834 7.63-7.631 8.309 8.309 0.742-0.742-8.309-8.309 7.631-7.631-0.834-0.255c-2.829-0.868-5.986-0.672-8.686 0.537-0.825-0.648-3.942-3.3-8.28-7.044 0.11-0.669 0.23-2.183-0.575-3.441l-0.352-0.549-8.001 8.001zM1.729 10.039l6.032-6.033c0.385 1.122 0.09 2.319 0.086 2.334l-0.08 0.314 0.245 0.214c7.409 6.398 8.631 7.39 8.992 7.546l-0.002 0.006 0.195 0.058 0.185-0.087c2.257-1.079 4.903-1.378 7.343-0.836l-13.482 13.481c-0.55-2.47-0.262-5.045 0.837-7.342l0.104-0.218-0.098-0.221-0.031 0.013c-0.322-0.632-1.831-2.38-7.498-8.944l-0.185-0.215-0.282 0.038c-0.338 0.045-0.668 0.069-0.981 0.069-0.595 0-1.053-0.083-1.38-0.176z"> </path> </g></svg>
          {{ favorites }}
        </div>
      </div>
      
      <div class="time-info dark:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="dark:stroke-gray-500"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linejoin="round" stroke-linecap="round" ></g><g id="SVGRepo_iconCarrier"> <path stroke-linecap="round" stroke-width="1.5" d="M12 8V12L15 15"></path> <circle stroke-width="1.5" r="9" cy="12" cx="12"></circle> </g></svg>
        {{ uploadDate }}
      </div>
    </div>
    
    <div class="user-info dark:border-gray-700">
      <div class="avatar dark:border-gray-600">
        <img :src="userAvatar" alt="User Avatar" />
      </div>
      <span class="username dark:text-gray-300">{{ username }}</span>
    </div>
  </div>
</template>  

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'

interface Props {
  title: string
  subTitle?: string
  content: string
  tags?: string[]
  tagColors?: string[]
  likes?: number | string
  comments?: number | string
  favorites?: number | string
  uploadDate?: string
  username: string
  userAvatar: string
}

const props = defineProps<Props>()
const themeStore = useThemeStore()

const defaultTags = ['']
const defaultColors = [
  '#1389eb', // 蓝色
  '#27ae60', // 绿色
  '#e74c3c', // 红色
  '#f39c12', // 橙色
  '#9b59b6', // 紫色
  '#16a085', // 青绿色
  '#3498db', // 天蓝色
  '#e67e22'  // 橙红色
]

const tags = computed(() => props.tags ?? defaultTags)

const truncatedContent = computed(() => {
  return props.content.length > 50
    ? props.content.slice(0, 50) + '...'
    : props.content
})

const isDarkMode = computed(() => {
  return themeStore.isDark
})

// 预先计算标签样式，避免对象注入风险
const tagStyles = computed(() => {
  // 创建安全的颜色数组
  const safeColors = props.tagColors && Array.isArray(props.tagColors) && props.tagColors.length > 0
    ? props.tagColors.map(color => ({ backgroundColor: String(color) }))
    : defaultColors.map(color => ({ backgroundColor: color }));
    
  return safeColors;
})
</script>


<style scoped>
  .task {
    position: relative;
    color: #2e2e2f;
    cursor: move;
    padding: 1.2rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    margin-bottom: 1rem;
    border: 2px solid transparent;
    max-width: 350px;
    transition: all 0.2s ease;
  }

  .task:hover {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 24px;
    border-color: rgba(162, 179, 207, 0.2) !important;
    transform: translateY(-2px);
  }

  .task-header {
    margin-bottom: 1rem;
  }

  .title {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 0.3rem 0;
  }

  .subtitle {
    font-size: 14px;
    margin: 0 0 0.5rem 0;
    font-weight: 400;
  }

  .task p.content {
    font-size: 15px;
    margin: 1.2rem 0;
    line-height: 1.5;
  }

  .tags-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    border-radius: 100px;
    padding: 4px 13px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block;
    white-space: nowrap;
  }

  .options {
    background: transparent;
    border: 0;
    padding: 4px;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .options:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .options svg {
    fill: #9fa4aa;
    width: 18px;
    height: 18px;
  }

  .stats {
    position: relative;
    width: 100%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    padding-top: 1rem;
  }

  .action-stats {
    display: flex;
    gap: 16px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: color 0.2s;
  }

  .stat-item:hover {
    color: #1389eb;
  }

  .stat-item svg {
    height: 16px;
    width: 16px;
    stroke: currentColor;
  }

  .time-info {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #888;
    font-size: 12px;
  }

  .time-info svg {
    height: 14px;
    width: 14px;
    stroke: currentColor;
  }

  .user-info {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.8rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
    border: 1px solid #eee;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .username {
    font-size: 14px;
    font-weight: 500;
  }
</style>