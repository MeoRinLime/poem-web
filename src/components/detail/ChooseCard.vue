<template>
  <div class="w-[300px] px-4 py-5 bg-white flex flex-col gap-3 rounded-md shadow-[0px_0px_15px_rgba(0,0,0,0.09)]">
    <legend class="text-xl font-semibold mb-3 select-none">{{ question }}</legend>
    <label v-for="(option, idx) in options" :key="idx" class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg peer-checked:text-blue-500 peer-checked:bg-blue-50 peer-checked:ring-blue-300 peer-checked:ring-1 select-none">
      {{ option }}
      <input
        type="radio"
        :value="option"
        v-model="selected"
        name="choice"
        class="w-4 h-4 absolute accent-current right-3"
      />
    </label>
    <button @click="onSubmit" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">提交</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const { question, options } = defineProps<{ question: string; options: string[] }>();
const emit = defineEmits<('submitOption', string)[]>();
const selected = ref<string>('');
const onSubmit = () => emit('submitOption', selected.value);
</script>
