<template>
  <ContentListPage
    title="诗歌交流集"
    :items="communicationList"
    :loading="loading"
    create-button-text="新建交流"
    item-key-field="postId"
    :field-mapping="fieldMapping"
    @create="goToNewCommunication"
    @item-click="goToDetail"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ContentListPage from '@/components/ContentListPage.vue'
import { getCommunicationList } from '@/api/post'
import type { Post } from '@/types/post'

const router = useRouter()
const communicationList = ref<Post[]>([])
const loading = ref(true)

// 定义字段映射
const fieldMapping = {
  title: 'title',
  subTitle: '',
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
    const response = await getCommunicationList()
    communicationList.value = response.data
  } catch (error) {
    console.error('获取交流列表失败:', error)
  } finally {
    loading.value = false
  }
})

const goToDetail = (post: Post) => {
  router.push({ 
    name: 'CommunicationDetail', 
    params: { postId: post.postId } 
  })
}

const goToNewCommunication = () => {
  router.push({ 
    name: 'CreateCommunication' 
  })
}

const handlePageChange = (page: number) => {
  // 如果需要从服务器获取分页数据，可以在这里处理
  console.log('当前页:', page)
}
</script>