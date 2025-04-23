<template>
  <ContentListPage
    title="诗歌长廊"
    :items="poems"
    :loading="loading"
    create-button-text="新建诗歌"
    item-key-field="poemId"
    :field-mapping="fieldMapping"
    :use-local-pagination="false"
    :total-items="total"
    @create="goToNewPoem"
    @item-click="goToDetail"
    @page-change="fetchPoems"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentListPage from '@/components/ContentListPage.vue'
import { getPagedUserPoems } from '@/api/poemUser'
import type { Poem } from '@/types/poem'

interface PaginationResult {
  content: any[]
  totalElements: number
}

const router = useRouter()
const poems = ref<Poem[]>([])
const loading = ref(true)
const total = ref(0)
const pageSize = 6

// 定义字段映射
const fieldMapping = {
  title: 'title',
  subTitle: 'subTitle',
  content: 'content',
  tags: 'tags',
  likes: 'likeCount',
  comments: 'commentCount',
  favorites: 'favoriteCount',
  date: 'createdAt',
  username: 'authorName',
  avatar: 'avatarUrl'
}

const fetchPoems = async (page: number) => {
  loading.value = true
  try {
    const response = await getPagedUserPoems(page, pageSize)
    const data = response.data as PaginationResult
    poems.value = data.content
    total.value = data.totalElements
  } catch (error) {
    console.error('获取诗歌列表失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (poem: Poem) => {
  router.push({ 
    name: 'UserPoemDetail', 
    params: { poemId: poem.poemId } 
  })
}

const goToNewPoem = () => {
  router.push({ 
    name: 'WritePoem' 
  })
}

onMounted(() => {
  fetchPoems(1)
})
</script>