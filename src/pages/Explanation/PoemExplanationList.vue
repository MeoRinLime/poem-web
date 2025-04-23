<template>
  <ContentListPage
    title="诗歌解析"
    :items="explanationList"
    :loading="loading"
    create-button-text="新建解析"
    item-key-field="postId"
    :field-mapping="fieldMapping"
    @create="goToNewExplanation"
    @item-click="goToDetail"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentListPage from '@/components/ContentListPage.vue'
import { getPoemExplanationList } from '@/api/post'
import type { Post } from '@/types/post'

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

onMounted(async () => {
  try {
    const response = await getPoemExplanationList()
    explanationList.value = response.data
  } catch (error) {
    console.error('获取诗歌解析列表失败:', error)
  } finally {
    loading.value = false
  }
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

const handlePageChange = (page: number) => {
  console.log('当前页:', page)
}
</script>