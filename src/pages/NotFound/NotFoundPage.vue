<template>
  <div class = "min-h-screen flex items-center justify-center p-4" >
    <n-result status="404" title="404 你似乎来到了没有知识的荒原" description="生活总归带点荒谬">
        <template #footer>
          <n-button @click="$router.push('/')">回到主页</n-button>
        </template>
    </n-result>
  </div>
</template>

<script lang="ts">

export default {
  name: 'NotFoundPage',
};
</script>