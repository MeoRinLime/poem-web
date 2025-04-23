<template>
  <content-detail-page
    content-type="poem"
    :content-id="poemId"
    back-text="返回诗歌长廊"
    :show-audio-player="false"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ContentDetailPage from '@/components/ContentDetailPage.vue'

const route = useRoute()
const poemId = Number(route.params.poemId)
</script>