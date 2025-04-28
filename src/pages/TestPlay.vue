<template>
  <ChooseCard
    question="你喜欢什么颜色？"
    :options="['红色', '蓝色', '绿色', '黄色']"
    @submit-option="onSubmit"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ChooseCard from '@/components/detail/ChooseCard.vue';
const emit = defineEmits<{
  submitOption: [option: string]
}>();
const selected = ref<string>('');
const onSubmit = (option: string) => {
  selected.value = option;
  emit('submitOption', option);
};
</script>
