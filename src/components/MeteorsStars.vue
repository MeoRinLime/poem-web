<!-- eslint-disable id-length -->
<!-- eslint-disable id-length -->
<template>
    <!-- 流星效果 -->
    <div class="line-box">
    <span
        class="line-item"
        v-for="(item, index) in lineList"
        :key="index"
        :style="{
        '--c1': item.c1,
        '--c2': item.c2,
        '--t': item.t,
        '--l': item.l,
        '--d': item.d,
        '--r': item.r,
        '--duration': item.duration,
        '--delay': item.delay,
        }"
    ></span>
    </div>
</template>

<script lang="ts" setup>

const lineList = ref(
  Array.from({ length: 15 }).map((_, index) => ({
    c1: index === 9 ? '#DA70D6' : Math.random() > 0.5 ? '#69E4F6' : '#FED258',
    c2: index === 9 ? '#FF69B4' : Math.random() > 0.5 ? '#69e4f600' : 'rgba(254,210,88,0)',
    t: `${Math.random() * 100}vh`,
    l: `${Math.random() * 100}vw`,
    d: Math.floor(Math.random() * 6),
    r: Math.random() * 360,
    duration: `${Math.random() * 3 + 2}s`, // 随机时间2-5s
    delay: `${Math.random() * 5}s`, // 随机延迟0-5s
  }))
);

</script>

<style lang="css" scoped>

.line-box {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none; /* 确保流星不会阻挡其他元素的交互 */
  z-index: 1;
}

.line-item {
  width: 2px;
  height: 80px;
  background: linear-gradient(0deg, var(--c1) 0%, var(--c2) 100%);
  position: absolute;
  top: var(--t);
  left: var(--l);
  transform: rotate(45deg);
  opacity: 0;
  animation: shank var(--duration) linear infinite; /* 使用随机持续时间 */
  animation-delay: var(--delay); /* 使用随机延迟 */
}

.line-item::after {
  content: '';
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c1);
  filter: blur(1.8px);
  box-shadow: 0px -1px -1px 5px var(--c2);
  bottom: -4px;
  left: 50%;
  transform: translate(-50%);
}

@keyframes shank {
  0% {
    transform: rotate(45deg) translateY(-200px) scale(0.5); /* 调整初始位置 */
    opacity: 0;
  }
  70% {
    opacity: 1;
    transform: rotate(45deg) translateY(200px) scale(1.1); /* 调整中间位置 */
  }
  100% {
    transform: rotate(45deg) translateY(400px) scale(0.5); /* 调整结束位置 */
    opacity: 0;
  }
}


</style>