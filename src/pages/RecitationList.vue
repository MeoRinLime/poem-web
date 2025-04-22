<template>
  <ContentListPage
    title="诗歌朗读"
    :items="recitationList"
    :loading="loading"
    create-button-text="新建朗读"
    item-key-field="postId"
    :field-mapping="fieldMapping"
    @create="goToNewRecitation"
    @item-click="goToDetail"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentListPage from '@/components/ContentListPage.vue'
import { getRecitationList } from '@/api/recitation'
import type { Recitation } from '@/types/recitation'

const router = useRouter()
const recitationList = ref<Recitation[]>([])
const loading = ref(true)
const total = ref(0)
const pageSize = 6

interface PaginationResult {
  content: any[]
  totalElements: number
}

// 定义字段映射
const fieldMapping = {
  title: 'title',
  content: 'content',
  tags: 'poemTitle',
  likes: 'likeCount',
  comments: 'commentCount',
  favorites: 'favoriteCount',
  date: 'createdAt',
  username: 'authorName',
  avatar: 'avatarUrl'
}

const fetchRecitations = async (page: number) => {
  loading.value = true
  try {
    const response = await getRecitationList(page, pageSize)
    const data = response as PaginationResult
    recitationList.value = data.content
    total.value = data.totalElements
  } catch (error) {
    console.error('获取朗读列表失败:', error)
  } finally {
    loading.value = false
  }
}

const goToDetail = (recitation: Recitation) => {
  router.push({ 
    name: 'RecitationDetail', 
    params: { recitationId: recitation.recitationId } 
  })
}

const goToNewRecitation = () => {
  router.push({ 
    name: 'CreateRecitation' 
  })
}

const handlePageChange = (page: number) => {
  console.log('当前页:', page)
}

onMounted(() => {
  fetchRecitations(1)
})
</script>