<template>
  <content-detail-page
    content-type="post"
    :content-id="postId"
    back-text="返回日常交流贴列表"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ContentDetailPage from '@/components/ContentDetailPage.vue'

const route = useRoute()
const postId = Number(route.params.postId)
</script>