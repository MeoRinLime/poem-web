<template>
    <div class="container noselect">
      <div class="canvas">
        <div class="tracker tr-1"></div>
        <div class="tracker tr-2"></div>
        <div class="tracker tr-3"></div>
        <div class="tracker tr-4"></div>
        <div class="tracker tr-5"></div>
        <div class="tracker tr-6"></div>
        <div class="tracker tr-7"></div>
        <div class="tracker tr-8"></div>
        <div class="tracker tr-9"></div>
        <div class="tracker tr-10"></div>
        <div class="tracker tr-11"></div>
        <div class="tracker tr-12"></div>
        <div class="tracker tr-13"></div>
        <div class="tracker tr-14"></div>
        <div class="tracker tr-15"></div>
        <div class="tracker tr-16"></div>
        <div class="tracker tr-17"></div>
        <div class="tracker tr-18"></div>
        <div class="tracker tr-19"></div>
        <div class="tracker tr-20"></div>
        <div class="tracker tr-21"></div>
        <div class="tracker tr-22"></div>
        <div class="tracker tr-23"></div>
        <div class="tracker tr-24"></div>
        <div class="tracker tr-25"></div>
        <div id="card">
          <div class="card-front">
            <div class="icon-container">
              <i class="icon"></i>
            </div>
            <div class="poem-title">{{ title }}</div>
            <div class="poem-author">{{ author }}</div>
            <div class="poem-dynasty">{{ dynasty }}</div>
          </div>
          <div class="card-back">
            <div class="poem-content">{{ truncatedContent }}</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  author: string;
  dynasty: string;
  content: string;
  maxLength?: number;
}

const props = defineProps<Props>();

// 默认最大显示120个字符，超出部分用省略号代替
const truncatedContent = computed(() => {
  const maxLen = props.maxLength || 120;
  if (props.content.length <= maxLen) {
    return props.content;
  }
  return props.content.substring(0, maxLen) + '...';
});
</script>
  
<style scoped>
  .container {
    position: relative;
    width: 190px;
    height: 254px;
    transition: 200ms;
    perspective: 1000px;
  }

  .container:active {
    width: 180px;
    height: 245px;
  }

  #card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    transition: 700ms;
    /* 更改为更适合诗歌主题的颜色 */
    background: linear-gradient(43deg, rgb(120, 144, 156) 0%, rgb(96, 125, 139) 46%, rgb(84, 110, 122) 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  /* 卡片翻转效果 */
  .container:hover #card {
    transform: rotateY(180deg);
  }

  /* 卡片正面和背面的共同样式 */
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: 20px;
    color: white;
  }

  /* 卡片背面样式 */
  .card-back {
    transform: rotateY(180deg);
    /* 移除滚动条 */
    overflow: hidden;
  }

  /* 诗歌标题样式 */
  .poem-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  /* 诗歌作者样式 */
  .poem-author {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  /* 诗歌朝代样式 */
  .poem-dynasty {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* 诗歌内容样式 */
  .poem-content {
    font-size: 1rem;
    line-height: 1.5;
    white-space: pre-line;
    text-align: center;
    /* 添加显示省略号的样式 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    max-height: 200px;
  }

  .icon-container {
    position: absolute;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    height: 60%;
    width: 60%;
    background-image: url('/img/book.gif');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.5
  }

  .tracker {
    position: absolute;
    z-index: 200;
    width: 100%;
    height: 100%;
  }

  .tracker:hover {
    cursor: pointer;
  }

  .container:hover #card::before {
    transition: 200ms;
    content: '';
    opacity: 80%;
  }

  .canvas {
    perspective: 800px;
    inset: 0;
    z-index: 200;
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas: "tr-1 tr-2 tr-3 tr-4 tr-5"
      "tr-6 tr-7 tr-8 tr-9 tr-10"
      "tr-11 tr-12 tr-13 tr-14 tr-15"
      "tr-16 tr-17 tr-18 tr-19 tr-20"
      "tr-21 tr-22 tr-23 tr-24 tr-25";
  }

  #card::before {
    content: '';
    /* 更改为更适合诗歌主题的颜色 */
    background: linear-gradient(43deg, rgb(120, 144, 156) 0%, rgb(96, 125, 139) 46%, rgb(84, 110, 122) 100%);
    filter: blur(2rem);
    opacity: 30%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    transition: 200ms;
  }

  .tr-1 { grid-area: tr-1; }
  .tr-2 { grid-area: tr-2; }
  .tr-3 { grid-area: tr-3; }
  .tr-4 { grid-area: tr-4; }
  .tr-5 { grid-area: tr-5; }
  .tr-6 { grid-area: tr-6; }
  .tr-7 { grid-area: tr-7; }
  .tr-8 { grid-area: tr-8; }
  .tr-9 { grid-area: tr-9; }
  .tr-10 { grid-area: tr-10; }
  .tr-11 { grid-area: tr-11; }
  .tr-12 { grid-area: tr-12; }
  .tr-13 { grid-area: tr-13; }
  .tr-14 { grid-area: tr-14; }
  .tr-15 { grid-area: tr-15; }
  .tr-16 { grid-area: tr-16; }
  .tr-17 { grid-area: tr-17; }
  .tr-18 { grid-area: tr-18; }
  .tr-19 { grid-area: tr-19; }
  .tr-20 { grid-area: tr-20; }
  .tr-21 { grid-area: tr-21; }
  .tr-22 { grid-area: tr-22; }
  .tr-23 { grid-area: tr-23; }
  .tr-24 { grid-area: tr-24; }
  .tr-25 { grid-area: tr-25; }

  /* 保留3D立体倾斜效果，但仅在悬停时不翻转时应用 */
  .container:not(:hover) .tr-1:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(20deg) rotateY(-10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-2:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(20deg) rotateY(-5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-3:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(20deg) rotateY(0deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-4:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(20deg) rotateY(5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-5:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(20deg) rotateY(10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-6:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(10deg) rotateY(-10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-7:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(10deg) rotateY(-5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-8:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(10deg) rotateY(0deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-9:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(10deg) rotateY(5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-10:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(10deg) rotateY(10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-11:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(0deg) rotateY(-10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-12:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(0deg) rotateY(-5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-13:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-14:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(0deg) rotateY(5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-15:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(0deg) rotateY(10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-16:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-10deg) rotateY(-10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-17:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-10deg) rotateY(-5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-18:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-10deg) rotateY(0deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-19:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-10deg) rotateY(5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-20:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-10deg) rotateY(10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-21:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-20deg) rotateY(-10deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-22:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-20deg) rotateY(-5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-23:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-24:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-20deg) rotateY(5deg) rotateZ(0deg);
  }

  .container:not(:hover) .tr-25:hover ~ #card {
    transition: 125ms ease-in-out;
    transform: rotateX(-20deg) rotateY(10deg) rotateZ(0deg);
  }

  .noselect {
    -webkit-touch-callout: none;
     /* iOS Safari */
    -webkit-user-select: none;
     /* Safari */
     /* Konqueror HTML */
    -moz-user-select: none;
     /* Old versions of Firefox */
    -ms-user-select: none;
     /* Internet Explorer/Edge */
    user-select: none;
     /* Non-prefixed version, currently
  									supported by Chrome, Edge, Opera and Firefox */
  }
</style>
