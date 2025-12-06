<script setup lang="ts">
import { ref, computed } from 'vue'

// 点击"不要"的次数
const refuseCount = ref(0)
// 是否已经同意
const agreed = ref(false)

// 根据拒绝次数改变 emoji
const emoji = computed(() => {
  const emojis = ['😊', '😐', '😕', '😟', '😢', '😭', '😡', '💔', '😤', '🤬']
  const index = Math.min(refuseCount.value, emojis.length - 1)
  return emojis[index] ?? '😊'
})

// emoji 大小随着拒绝次数增加
const emojiSize = computed(() => {
  return Math.min(100 + refuseCount.value * 10, 200)
})

// "可以"按钮的缩放比例
const yesButtonScale = computed(() => {
  return 1 + refuseCount.value * 0.3
})

// "不要"按钮的缩放比例
const noButtonScale = computed(() => {
  return refuseCount.value > 0 ? 0.7 : 1
})

// 第二个按钮的文本随着点击次数变化
const noButtonText = computed(() => {
  const texts: string[] = [
    '不要',
    '？你认真的吗？',
    '要不再想想？',
    '不许选这个？',
    '我会想你的！',
    '真的不考虑？'
  ]
  const index = Math.min(refuseCount.value, texts.length - 1)
  return texts[index] || '不要'
})

// 处理点击"可以"
const handleYes = () => {
  agreed.value = true
}

// 处理点击"不要"
const handleNo = () => {
  refuseCount.value++
}
</script>

<template>
  <div class="test-play-container" :class="{ 'agreed-state': agreed }">
    <!-- 同意后的显示 -->
    <div v-if="agreed" class="agreed-message">
      ！！！喜欢你!!ヾ(◍°∇°◍)ﾉﾞ
    </div>

    <!-- 正常状态 -->
    <template v-else>
      <!-- 顶部文字 -->
      <h1 class="title">你愿意做我的儿子吗?</h1>

      <!-- 中间的 emoji -->
      <div class="emoji-container">
        <div 
          class="emoji" 
          :style="{ fontSize: `${emojiSize}px` }"
        >
          {{ emoji }}
        </div>
      </div>

      <!-- 按钮区域 -->
      <div class="buttons-container" :class="{ 'centered': refuseCount > 0 }">
        <button 
          class="btn btn-yes" 
          :style="{ transform: `scale(${yesButtonScale})` }"
          @click="handleYes"
        >
          可以
        </button>
        <button 
          class="btn btn-no" 
          :class="{ 'btn-hidden': refuseCount >= 6, 'positioned': refuseCount > 0 }"
          :style="{ transform: `scale(${noButtonScale})` }"
          @click="handleNo"
        >
          {{ noButtonText }}
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.test-play-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  transition: background 0.8s ease;
}

.test-play-container.agreed-state {
  background: linear-gradient(135deg, #ffc0cb 0%, #ffb6c1 50%, #ff69b4 100%);
}

.agreed-message {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 2rem;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.15);
  }
}

.title {
  position: absolute;
  top: 10rem;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.emoji-container {
  margin-bottom: 4rem;
}

.emoji {
  transition: font-size 0.5s ease, transform 0.3s ease;
  display: inline-block;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.buttons-container {
  display: flex;
  gap: 2rem;
  position: relative;
  z-index: 1;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease;
}

.buttons-container.centered {
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  min-width: 120px;
  white-space: nowrap;
}

.btn-yes {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform-origin: center;
  z-index: 10;
  position: relative;
}

.btn-yes:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-no {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transition: all 0.5s ease;
  position: relative;
}

.btn-no.positioned {
  position: absolute;
  right: -150px;
  bottom: -80px;
}

.btn-no:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.btn-no.btn-hidden {
  opacity: 0;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
    top: 2rem;
    padding: 0 1rem;
    text-align: center;
  }

  .buttons-container {
    gap: 1rem;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    min-width: 100px;
  }
}
</style>
