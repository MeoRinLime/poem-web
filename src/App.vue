<template>
  <n-message-provider>
    <div :class="isFullScreenPage ? 'fixed-container' : 'scroll-container'">
      <!-- 导航栏 -->
      <Header class="flex-shrink-0"></Header>

      <!-- 流星效果-->
      <MeteorsStars class="fixed-container"></MeteorsStars>
      
      <!-- 内容区域 -->
      <div class="relative flex-grow">
        <!-- 背景图片（已替换渐变和网格） -->
        <div 
          class="fixed inset-0 bg-[url(/img/background.png)] bg-cover bg-center bg-no-repeat z-0 opacity-20"
        ></div>

        <!-- 主内容 -->
        <main class="relative z-10">
          <router-view :key="$route.fullPath"/>
        </main>
      </div>

      <!-- 页脚 -->
      <footer class="py-6 text-sm text-center text-gray-700"></footer>
    </div>
  </n-message-provider>
</template>