<script setup lang="ts">
import { ref } from 'vue';

const answer = ref('');  // 用户输入的答案
const correctAnswer = '罕见';  // 正确答案，根据需要修改
const audioPlayed = ref(false);  // 控制音频是否已播放

function checkAnswer() {
  if (answer.value === correctAnswer) {
    const audio = new Audio('hanjian.mp3');  // 音频文件路径
    audio.play();
    audioPlayed.value = true;
  } else {
    alert('这都猜不出来你也是个神人了');  // 错误提示
  }
}
</script>

<template>
  <div class="container relative max-w-2xl mx-auto bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 top-16">
    <div class="container">
      <!-- 条件渲染，只有当音频没有播放时才显示输入框 -->
      <div v-if="!audioPlayed" class="input-wrapper">
        <p>我是谁</p>
        <img src="../assets/hanjian/dxl.jpg" alt="冬雪莲" />
        <input v-model="answer" type="text" placeholder="仔细想好哦~" @keyup.enter="checkAnswer" class="input-box">
        <button @click="checkAnswer" class="submit-button">提交</button>
      </div>
      <div v-else>
        <p>我去，有罕见！</p>
        <img src="../assets/hanjian/hanjian.jpg" alt="罕见" />
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  text-align: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-box {
  padding: 8px 16px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
