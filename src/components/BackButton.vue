<template>
    <button :disabled="disabled" class="noselect" @click="handleClick">
        <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg>
        </span>
        <span class="text">返回</span>
    </button>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
button {
  font-family: inherit;
  overflow: hidden;
  display: flex;
  padding: 0.7em 3em;
  min-width: 100px;
  background: #e62222;
  font-size: 15px;
  font-weight: 500;
  align-items: center;
  justify-items: center;
  border: none;
  border-radius: 16px;
  box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
  cursor: pointer;
  position: relative;
}

button, button span {
  transition: 200ms;
}

button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
}

button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
}


button .text {
  transform: translateX(0);
  color: white;
  font-weight: bold;
}

button .icon {
  position: absolute;
  border-left: 1px solid #c41b1b;
  right: -40px;
  transform: translateX(0);
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.3s ease-in-out;
}

button svg {
  width: 15px;
  fill: #eee;
}

button:hover {
  background: #ff3636;
}

button:hover .text {
  color: transparent;
}

button:hover .icon {
  width: 100%;
  border-left: none;
  transform: translateX(0);
  right: 0;
}

button:focus {
  outline: none;
}

button:active .icon svg {
  transform: scale(0.8);
}
</style>