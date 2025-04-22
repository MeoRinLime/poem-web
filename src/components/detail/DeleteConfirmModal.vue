<template>
    <n-modal
      v-model:show="localVisible"
      preset="dialog"
      title="确认删除"
      positive-text="确认删除"
      negative-text="取消"
      @positive-click="$emit('confirm')"
      @negative-click="$emit('update:visible', false)"
    >
      <template #default>
        <div class="py-2">
          确定要删除《{{ title }}》吗？此操作不可撤销。
        </div>
      </template>
    </n-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { NModal } from 'naive-ui'
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['update:visible', 'confirm'])
  
  const localVisible = ref(props.visible)
  
  watch(() => props.visible, (val) => {
    localVisible.value = val
  })
  
  watch(localVisible, (val) => {
    emit('update:visible', val)
  })
  </script>