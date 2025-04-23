<template>
    <content-detail-page
      content-type="recitation"
      :content-id="recitationId"
      back-text="返回朗读列表"
      :show-audio-player="true"
    />
</template>
  
<script setup lang="ts">
import { useRoute } from 'vue-router'
import ContentDetailPage from '@/components/ContentDetailPage.vue'

const route = useRoute()
const recitationId = Number(route.params.recitationId)
</script>