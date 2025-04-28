<template>
  <div class="min-h-screen flex items-center justify-center">
    <div v-if="loading" class="text-center text-lg">加载中...</div>
    <div v-else>
     <div class="mb-4 text-sm text-gray-500 text-center">
       <span>{{ question.category }}</span> | <span>{{ question.source }}</span>
     </div>
      <ChooseCard
        v-if="!submitted" 
        :question="question.question" 
        :options="question.options" 
        @submit-option="onSubmit" />
      <div v-else class="text-center">
        <p v-if="isCorrect" class="text-green-500 text-xl mb-4">回答正确！</p>
        <p v-else class="text-red-500 text-xl mb-4">回答错误，正确答案是：{{ correctAnswer }}</p>
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="loadQuestion">下一题</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import ChooseCard from '@/components/detail/ChooseCard.vue';
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

const loadQuestion = async () => {
  loading.value = true;
  submitted.value = false;
  try {
    const data = await getRandomQuestion();
    question.value = {
      questionId: data.questionId,
      question: data.question,
      options: [data.optionA, data.optionB, data.optionC, data.optionD],
      category: data.category,
      source: data.source
    };
  } catch (error) {
    console.error('获取题目失败:', error);
  } finally {
    loading.value = false;
  }
};

const onSubmit = async (option: string) => {
  try {
    const response = await submitAnswer(authStore.username, authStore.userId, question.value.questionId, option);
    isCorrect.value = response.isCorrect;
    correctAnswer.value = response.correctAnswer;
    submitted.value = true;
  } catch (error) {
    console.error('提交回答失败:', error);
  }
};

onMounted(loadQuestion);
</script>