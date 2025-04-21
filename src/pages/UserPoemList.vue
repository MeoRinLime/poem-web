<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <n-card 
      class="max-w-6xl w-full mx-auto shadow-2xl rounded-2xl mt-12"
      :content-style="{ padding: '16px' }"
    >
      <!-- 页面标题和添加按钮 -->
      <div class="flex justify-between items-center mb-8">
        <BigTitle text="诗歌长廊" />
        <CreateButton 
          @click="goToNewPoem"
        >
          新建诗歌
        </CreateButton>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-64">
        <LoadingComponent />
      </div>

      <!-- 诗歌列表 -->
      <n-grid v-else-if="poems.length > 0" :cols="isMobile ? 1 : 3" :x-gap="24" :y-gap="24">
        <n-grid-item 
          v-for="poem in poems" 
          :key="poem.poemId"
          class="cursor-pointer hover:scale-105 transition-transform"
          @click="goToDetail(poem.poemId)"
        >
          <PresentationCard 
            :title="poem.title"
            :sub-title="poem.subTitle || ''"
            :content="poem.content"
            :likes="poem.likeCount || 0"
            :comments="poem.commentCount || 0"
            :favorites="poem.favoriteCount || 0"
            :upload-date="poem.createdAt"
            :username="poem.authorName"
            :user-avatar="poem.avatarUrl || null"
            :avatar-loading="!poem.avatarLoaded"
          />
        </n-grid-item>
      </n-grid>

      <div v-else class="text-center py-12 text-gray-500">
        暂无诗歌数据
      </div>

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
import { ref, computed, onMounted } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NPagination,
} from 'naive-ui'
import { useRouter } from 'vue-router'
import { getPagedUserPoems } from '@/api/poemUser'
import { getUserAvatarByUsername } from '@/api/personalCenter'
import type { Poem } from '@/types/poem'

interface PaginationResult {
  content: any[]
  totalElements: number
}

const DEFAULT_AVATAR = '/default-avatar.png'
const router = useRouter()

const poems = ref<Poem[]>([])
const isMobile = ref(false)
const total = ref(0)
const loading = ref(false)
const avatarCache = new Map<string, string>()

// 分页相关
const currentPage = ref(1)
const pageSize = 6

// 计算总页数
const pageCount = computed(() => Math.ceil(total.value / pageSize))

// 在组件顶部添加一个专门用于跟踪进行中请求的Map
const pendingAvatarRequests = new Map<string, Promise<string>>();

const fetchPoems = async (page: number) => {
  loading.value = true;
  try {
    const response = await getPagedUserPoems(page, pageSize);
    const data = response.data as PaginationResult;

    // 先使用默认头像显示诗歌列表
    poems.value = data.content.map(poem => ({
      ...poem,
      avatarUrl: DEFAULT_AVATAR,
      avatarLoaded: false
    }));
    //console.log('poems', poems.value)
    total.value = data.totalElements;
    
    // 收集需要加载的唯一作者名称
    const uniqueAuthors = new Set(data.content.map(poem => poem.authorName));
    
    // 对每个唯一作者只发起一次请求
    for (const authorName of uniqueAuthors) {
      // 创建一个函数来负责获取或创建头像请求
      const getOrCreateAvatarRequest = async () => {
        // 如果缓存中已有结果，直接返回
        if (avatarCache.has(authorName)) {
          return avatarCache.get(authorName)!;
        }
        
        try {
          // 请求头像
          const avatarUrl = await getUserAvatarByUsername(authorName);
          // 存入缓存
          avatarCache.set(authorName, avatarUrl);
          return avatarUrl;
        } catch (error) {
          console.error('获取头像失败:', authorName, error);
          avatarCache.set(authorName, DEFAULT_AVATAR);
          return DEFAULT_AVATAR;
        } finally {
          // 请求完成后，移除进行中的请求记录
          pendingAvatarRequests.delete(authorName);
        }
      };
      
      // 如果已经有进行中的请求，使用该请求
      if (pendingAvatarRequests.has(authorName)) {
        const pendingRequest = pendingAvatarRequests.get(authorName)!;
        pendingRequest.then(avatarUrl => {
          // 更新所有具有相同作者的诗歌
          poems.value.forEach((poem, idx) => {
            if (poem.authorName === authorName) {
              poems.value[idx].avatarUrl = avatarUrl;
              poems.value[idx].avatarLoaded = true;
            }
          });
        });
      } else {
        // 否则创建新请求并保存
        const newRequest = getOrCreateAvatarRequest();
        pendingAvatarRequests.set(authorName, newRequest);
        
        newRequest.then(avatarUrl => {
          // 更新所有具有相同作者的诗歌
          poems.value.forEach((poem, idx) => {
            if (poem.authorName === authorName) {
              poems.value[idx].avatarUrl = avatarUrl;
              poems.value[idx].avatarLoaded = true;
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('获取诗歌列表失败:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchPoems(page)
}

// 跳转到详情页
const goToDetail = (poemId: number) => {
  router.push({ name: 'UserPoemDetail', params: { poemId } })
}

// 跳转到新建诗歌页面
const goToNewPoem = () => {
  router.push({ name: 'WritePoem' })
}

// 监听窗口大小变化
const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobileStatus()
  window.addEventListener('resize', updateMobileStatus)
  fetchPoems(1)
})

// 组件卸载时移除事件监听
const onUnmounted = () => {
  window.removeEventListener('resize', updateMobileStatus)
}
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
  .text-4xl {
    font-size: 18px;
  }
  .text-xl {
    font-size: 16px;
  }
  .text-lg {
    font-size: 14px;
  }
  .text-sm {
    font-size: 12px;
  }
  .text-xs {
    font-size: 10px;
  }
}
</style>