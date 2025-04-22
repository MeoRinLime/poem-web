<!-- eslint-disable security/detect-object-injection -->
<template>
    <div class="min-h-screen flex flex-col items-center p-4">
      <n-card 
        class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
        :content-style="{ padding: '16px' }"
      >
        <!-- 页面标题和添加按钮 -->
        <div class="flex justify-between items-center mb-8">
          <BigTitle :text="title" />
          <CreateButton 
            v-if="showCreateButton"
            @click="onCreateClick"
          >
            {{ createButtonText }}
          </CreateButton>
        </div>
  
        <div v-if="loading" class="flex items-center justify-center h-64">
          <LoadingComponent />
        </div>
  
        <!-- 内容为空时的提示 -->
        <div v-else-if="items.length === 0" class="text-center py-12 text-gray-500">
          {{ emptyText }}
        </div>
  
        <!-- 内容列表 -->
        <n-grid v-else :cols="isMobile ? 1 : 3" :x-gap="24" :y-gap="24">
          <n-grid-item 
            v-for="item in paginatedItems" 
            :key="getItemKey(item)"
            class="cursor-pointer hover:scale-105 transition-transform"
            @click="onItemClick(item)"
          >
            <PresentationCard 
              :title="getItemTitle(item)"
              :sub-title="getItemSubTitle(item)"
              :content="item.content"
              :tags="getItemTags(item)"
              :likes="getItemLikes(item)"
              :comments="getItemComments(item)"
              :favorites="getItemFavorites(item)"
              :upload-date="getItemDate(item)"
              :username="getItemUsername(item)"
              :user-avatar="itemAvatars[getItemKey(item)] || defaultAvatar"
            />
          </n-grid-item>
        </n-grid>
  
        <!-- 分页组件 -->
        <div v-if="pageCount > 1" class="mt-8 flex justify-center">
          <n-pagination 
            v-model:page="currentPage"
            :page-count="pageCount"
            :page-size="pageSize"
            @update:page="handlePageChange"
          />
        </div>
      </n-card>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
  import { 
    NCard, NGrid, NGridItem, NPagination,
  } from 'naive-ui'
  import { getUserAvatarByUsername } from '@/api/personalCenter'

  // 通用数据项接口
  interface GenericItem {
    [key: string]: any
  }
  
  // 定义组件属性
  const props = defineProps({
    // 页面标题
    title: {
      type: String,
      required: true
    },
    // 数据列表
    items: {
      type: Array as () => GenericItem[],
      default: () => []
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 每页显示数量
    pageSize: {
      type: Number,
      default: 6
    },
    // 是否显示创建按钮
    showCreateButton: {
      type: Boolean,
      default: true
    },
    // 创建按钮文本
    createButtonText: {
      type: String,
      default: '新建'
    },
    // 获取列表项的唯一键的字段名
    itemKeyField: {
      type: String,
      default: 'id'
    },
    // 空数据提示文本
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    // 是否使用本地分页
    useLocalPagination: {
      type: Boolean,
      default: true
    },
    // 总数据量（服务器分页时使用）
    totalItems: {
      type: Number,
      default: 0
    },
    // 自定义字段映射
    fieldMapping: {
      type: Object,
      default: () => ({
        title: 'title',
        subTitle: 'subTitle',
        content: 'content',
        tags: 'tags',
        likes: 'likeCount',
        comments: 'commentCount',
        favorites: 'favoriteCount',
        date: 'createdAt',
        username: 'userName',
        avatar: 'avatarUrl',
      })
    },
    // 默认头像
    defaultAvatar: {
      type: String,
      default: '/default-avatar.png'
    }
  })
  
  // 定义事件
  const emit = defineEmits(['create', 'item-click', 'page-change'])
  
  // 响应式状态
  const currentPage = ref(1)
  const isMobile = ref(false)
  
  // 存储每个项目的头像
  const itemAvatars = ref<Record<string, string>>({})
  
  // 存储用户名到头像的映射，这样可以跨页面和列表复用
  const usernameToAvatarMap = ref<Record<string, string>>({})
  
  // 跟踪正在加载的用户名，避免并发重复请求
  const loadingUsernames = new Set<string>()
  
  // 计算属性
  const pageCount = computed(() => {
    if (props.useLocalPagination) {
      return Math.ceil(props.items.length / props.pageSize)
    } else {
      return Math.ceil(props.totalItems / props.pageSize)
    }
  })
  
  // 如果使用本地分页，计算当前页的数据
  const paginatedItems = computed(() => {
    if (props.useLocalPagination) {
      const start = (currentPage.value - 1) * props.pageSize
      return props.items.slice(start, start + props.pageSize)
    } else {
      return props.items
    }
  })
  
  // 获取项目各个字段的方法
  const getItemKey = (item: GenericItem) => {
    return item[props.itemKeyField] || item.id || item.postId || item.poemId
  }
  
  const getItemTitle = (item: GenericItem) => {
    return item[props.fieldMapping.title] || ''
  }
  
  const getItemSubTitle = (item: GenericItem) => {
    const subTitleField = props.fieldMapping.subTitle
    if (subTitleField === 'poemInfo' && item.poemTitle && item.poemAuthor) {
      return `${item.poemTitle} - ${item.poemAuthor}`
    }
    return item[subTitleField] || ''
  }
  
  const getItemTags = (item: GenericItem) => {
    const tagsField = props.fieldMapping.tags
    if (tagsField === 'poemId' && item.poemId) {
      return [item.poemId]
    }
    const tags = item[tagsField] || []
    return tags.length > 0 ? tags : ['']
  }
  
  const getItemLikes = (item: GenericItem) => {
    return item[props.fieldMapping.likes] || 0
  }
  
  const getItemComments = (item: GenericItem) => {
    return item[props.fieldMapping.comments] || 0
  }
  
  const getItemFavorites = (item: GenericItem) => {
    return item[props.fieldMapping.favorites] || 0
  }
  
  const getItemDate = (item: GenericItem) => {
    return item[props.fieldMapping.date] || ''
  }
  
  const getItemUsername = (item: GenericItem) => {
    const usernameField = props.fieldMapping.username
    return item[usernameField] || item.authorName || ''
  }
  
  // 加载所有项目的头像
  const loadAvatars = async () => {
    for (const item of paginatedItems.value) {
      const itemKey = getItemKey(item)
      const username = getItemUsername(item)
      
      if (!username) continue
      
      // 如果项目没有头像
      if (!itemAvatars.value[itemKey]) {
        // 检查是否已经有该用户名的头像缓存
        if (usernameToAvatarMap.value[username]) {
          // 如果已缓存，直接使用
          itemAvatars.value[itemKey] = usernameToAvatarMap.value[username]
        } else if (!loadingUsernames.has(username)) {
          // 如果未缓存，且不在加载中，才发送请求
          loadingUsernames.add(username)
          try {
            const avatar = await getUserAvatarByUsername(username)
            if (avatar) {
              // 同时更新两个缓存
              usernameToAvatarMap.value[username] = avatar
              itemAvatars.value[itemKey] = avatar
            } else {
              usernameToAvatarMap.value[username] = props.defaultAvatar
              itemAvatars.value[itemKey] = props.defaultAvatar
            }
          } catch (error) {
            console.error('获取头像失败:', error)
            usernameToAvatarMap.value[username] = props.defaultAvatar
            itemAvatars.value[itemKey] = props.defaultAvatar
          } finally {
            loadingUsernames.delete(username)
          }
        }
      }
    }
  }
  
  // 处理分页变化
  const handlePageChange = (page: number) => {
    currentPage.value = page
    emit('page-change', page)
    
    // 页面变化后重新加载头像
    loadAvatars()
  }
  
  // 处理创建按钮点击
  const onCreateClick = () => {
    emit('create')
  }
  
  // 处理列表项点击
  const onItemClick = (item: GenericItem) => {
    emit('item-click', item)
  }
  
  // 监听窗口大小变化
  const updateMobileStatus = () => {
    isMobile.value = window.innerWidth < 768
  }
  
  // 监视分页项变化，加载新的头像
  watchEffect(() => {
    if (paginatedItems.value.length > 0 && !props.loading) {
      loadAvatars()
    }
  })
  
  onMounted(() => {
    updateMobileStatus()
    window.addEventListener('resize', updateMobileStatus)
    
    // 初始加载头像
    if (paginatedItems.value.length > 0) {
      loadAvatars()
    }
  })
  
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', updateMobileStatus)
  })
  </script>
  
  <style scoped>
  .min-h-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .max-w-6xl {
    max-width: 1140px;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .hover\:scale-105:hover {
    transform: scale(1.05);
  }
  
  .transition-transform {
    transition: transform 0.3s ease;
  }
  
  @media (max-width: 767px) {
    .p-4 {
      padding: 16px;
    }
  }
  </style>