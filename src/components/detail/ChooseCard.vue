<template>
  <div class="w-[300px] px-4 py-5 bg-white flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
    <h2 class="text-xl font-semibold mb-3 select-none">{{ question }}</h2>
    <label
      v-for="(option, idx) in options" :key="idx" :class="[
      'font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg select-none',
      selected === option ? 'text-blue-500 bg-blue-50 ring-blue-300 ring-1' : ''
    ]">
      {{ option }}
      <input
        v-model="selected"
        type="radio"
        :value="option"
        name="choice"
        class="w-4 h-4 absolute accent-current right-3"
      />
    </label>
    <button
      type="button"
      :disabled="!selected"
      class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="onSubmit"
    >
      提交
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const { question, options } = defineProps<{ question: string; options: string[] }>();
const emit = defineEmits<{ (e: 'submitOption', option: string): void }>();
const selected = ref<string>('');
const onSubmit = () => emit('submitOption', selected.value);
</script>
