<template>
  <ContentListPage
    title="诗歌解析"
    :items="explanationList"
    :loading="loading"
    create-button-text="新建解析"
    item-key-field="postId"
    :field-mapping="fieldMapping"
    :use-local-pagination="false"
    :total-items="totalItems"
    :page-size="pageSize"
    @create="goToNewExplanation"
    @item-click="goToDetail"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentListPage from '@/components/ContentListPage.vue'
import { getPostList } from '@/api/post'
import type { Post } from '@/types/post'

// pagination state
const currentPage = ref(1)
const pageSize = 6
const totalItems = ref(0)

const router = useRouter()
const explanationList = ref<Post[]>([])
const loading = ref(true)

// 定义字段映射
const fieldMapping = {
  title: 'title',
  subTitle: 'poemInfo', // 特殊处理，会将 poemTitle 和 poemAuthor 组合
  content: 'content',
  tags: 'tag',
  likes: 'likeCount',
  comments: 'commentCount',
  favorites: 'favoriteCount',
  date: 'createdAt',
  username: 'userName',
  avatar: 'avatarUrl'
}

// 加载列表函数
async function loadList(page: number) {
  loading.value = true
  try {
    const resp = await getPostList(page, pageSize, 1)
    explanationList.value = resp.content
    totalItems.value = resp.totalElements
    currentPage.value = page
  } catch (error) {
    console.error('获取诗歌解析列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadList(currentPage.value)
})

const goToDetail = (post: Post) => {
  router.push({ 
    name: 'PoemExplanationDetail', 
    params: { postId: post.postId } 
  })
}

const goToNewExplanation = () => {
  router.push({ 
    name: 'CreatePoemExplanation' 
  })
}

// 处理分页变化
function handlePageChange(page: number) {
  loadList(page)
}
</script>