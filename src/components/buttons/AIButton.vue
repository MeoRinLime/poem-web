<template>
  <button
    class="c-button c-button--gooey"
    :disabled="disabled"
    :class="{ 'c-button--loading': loading }"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <span v-else>{{ text }}</span>
    <div class="c-button__blobs" :style="blobStyle">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </button>
  <svg
    style="display: block; height: 0; width: 0;"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="goo">
        <feGaussianBlur
          result="blur"
          stdDeviation="10"
          in="SourceGraphic"
        ></feGaussianBlur>
        <feColorMatrix
          result="goo"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          mode="matrix"
          in="blur"
        ></feColorMatrix>
        <feBlend in2="goo" in="SourceGraphic"></feBlend>
      </filter>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '点击我',
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#06c8d9'
  }
});

const emit = defineEmits(['click']);

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};

const blobStyle = computed(() => {
  return {
    '--button-color': props.color
  };
});
</script>

<style scoped>
  .c-button {
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
    padding: 0.1em 1.0em;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    z-index: 1;
  }

  .c-button--gooey {
    color: var(--button-color, #06c8d9);
    background-color: transparent;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 4px solid var(--button-color, #06c8d9);
    position: relative;
    transition: all 700ms ease;
    border-radius: 999px;
  }

  .c-button--gooey:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .c-button--loading {
    cursor: wait;
  }

  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .c-button--gooey .c-button__blobs {
    height: 100%;
    filter: url(#goo);
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    bottom: -3px;
    right: -1px;
    z-index: -1;
    border-radius: 20px;
  }

  .c-button--gooey .c-button__blobs div {
    background-color: var(--button-color, #06c8d9);
    width: 34%;
    height: 100%;
    border-radius: 100%;
    position: absolute;
    transform: scale(1.4) translateY(125%) translateZ(0);
    transition: all 700ms ease;
  }

  .c-button--gooey .c-button__blobs div:nth-child(1) {
    left: -5%;
  }

  .c-button--gooey .c-button__blobs div:nth-child(2) {
    left: 30%;
    transition-delay: 60ms;
  }

  .c-button--gooey .c-button__blobs div:nth-child(3) {
    left: 66%;
    transition-delay: 25ms;
  }

  .c-button--gooey:hover:not(:disabled):not(.c-button--loading) {
    color: #fff;
  }

  .c-button--gooey:hover:not(:disabled):not(.c-button--loading) .c-button__blobs div {
    transform: scale(1.4) translateY(0) translateZ(0);
  }
</style>
