<template>
  <div class="min-h-screen flex items-center justify-center to-white p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden relative z-10">
      <div class="w-full h-2 bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200"></div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="py-16 flex flex-col items-center justify-center">
        <LoadingComponent />
        <p class="mt-4 text-gray-600 font-serif italic">寻觅佳题中...</p>
      </div>
      
      <!-- 内容区域 -->
      <div v-else class="p-6">
        <!-- 问题类别和来源 -->
        <div class="mb-6 text-sm text-gray-500 text-center font-serif flex items-center justify-center gap-3">
          <span class="px-3 py-1 rounded-full bg-amber-50 border border-amber-200">{{ question.category }}</span>
          <span class="w-1 h-1 rounded-full bg-gray-300"></span>
          <span class="px-3 py-1 rounded-full bg-amber-50 border border-amber-200">{{ question.source }}</span>
        </div>
        
        <!-- 问题卡片 -->
        <transition name="fade" mode="out-in">
          <div v-if="!submitted" class="mb-4">
            <h2 class="text-xl font-serif text-gray-800 mb-6 select-none leading-relaxed">{{ question.question }}</h2>
            
            <div class="space-y-3">
              <label
                v-for="(option, idx) in question.options" 
                :key="idx" 
                :class="[
                  'font-medium relative hover:bg-amber-50 flex items-center px-4 py-3 gap-3 rounded-lg select-none border transition-all duration-200',
                  selected === option 
                    ? 'text-amber-800 bg-amber-50 border-amber-200' 
                    : 'border-gray-100 hover:border-amber-100'
                ]"
              >
                <div class="flex-1">{{ option }}</div>
                <div
                  :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200',
                  selected === option 
                    ? 'border-amber-400 bg-amber-100' 
                    : 'border-gray-300'
                ]">
                  <div v-if="selected === option" class="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                </div>
                <input
                  v-model="selected"
                  type="radio"
                  :value="option"
                  name="choice"
                  class="sr-only"
                />
              </label>
            </div>
            
            <button
              type="button"
              :disabled="!selected"
              :class="[
                'mt-6 w-full px-5 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2',
                selected 
                  ? 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 focus:ring-amber-300' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
              ]"
              @click="onSubmit"
            >
              提交答案
            </button>
          </div>
        
          <!-- 答案反馈 -->
          <div v-else class="text-center py-4">
            <div class="flex justify-center mb-6">
              <div v-if="isCorrect" class="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div v-else class="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <p :class="isCorrect ? 'text-green-600' : 'text-red-600'" class="text-xl mb-4 font-serif">
              {{ feedbackMessage }}
            </p>
            
            <button 
              class="mt-4 px-6 py-3 bg-amber-100 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 w-full font-serif"
              @click="loadQuestion">
              <span class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                下一题
              </span>
            </button>
          </div>
        </transition>
        
        <!-- 问题计数器 -->
        <!-- <div class="mt-6 text-center text-sm text-gray-500 font-serif">
          <span>已答题数：{{ questionCount }}</span>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getRandomQuestion, submitAnswer } from '@/api/questions';
import { useAuthStore } from '@/store/auth';

interface QuestionData {
  questionId: number;
  question: string;
  options: string[];
  category: string;
  source: string;
}

const authStore = useAuthStore();
const loading = ref(true);
const question = ref<QuestionData>({ questionId: 0, question: '', options: [], category: '', source: '' });
const submitted = ref(false);
const isCorrect = ref(false);
const correctAnswer = ref('');
const selected = ref<string>('');
const questionCount = ref(0);
const feedbackMessage = ref(''); // 用于保存完整的反馈消息

const loadQuestion = async () => {
  loading.value = true;
  submitted.value = false;
  selected.value = '';
  try {
    const data = await getRandomQuestion();
    question.value = {
      questionId: data.questionId,
      question: data.question,
      options: [data.optionA, data.optionB, data.optionC, data.optionD],
      category: data.category,
      source: data.source
    };
    questionCount.value++;
  } catch (error) {
    console.error('获取题目失败:', error);
  } finally {
    loading.value = false;
  }
};

// 将选项内容转换为选项标识（A、B、C、D）
const getOptionLetter = (optionContent: string): string => {
  const index = question.value.options.findIndex(option => option === optionContent);
  if (index === -1) return '';
  return String.fromCharCode(65 + index); // 65是ASCII中'A'的编码
};

const onSubmit = async () => {
  if (!selected.value) return;
  
  try {
    // 获取选项对应的字母（A、B、C、D）
    const answerLetter = getOptionLetter(selected.value);
    const response = await submitAnswer(authStore.username, authStore.userId, question.value.questionId, answerLetter);
    
    // 处理API直接返回的消息字符串
    const responseMessage = response.toString();
    
    // 检查返回消息来判断是否答对
    isCorrect.value = responseMessage.includes('回答正确');
    
    // 如果答错，从返回消息中提取正确答案
    if (!isCorrect.value && responseMessage.includes('正确答案是：')) {
      const match = responseMessage.match(/正确答案是：([A-D])/);
      correctAnswer.value = match ? match[1] : '';
    } else {
      correctAnswer.value = '';
    }
    
    // 保存完整反馈消息，用于显示
    feedbackMessage.value = responseMessage;
    submitted.value = true;
  } catch (error) {
    console.error('提交回答失败:', error);
  }
};

onMounted(loadQuestion);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>