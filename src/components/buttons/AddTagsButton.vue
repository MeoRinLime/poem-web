<template>
    <button class="Btn" @click="handleClick">
      {{ text }}
      <svg  class="svgIcon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3532" width="200" height="200"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#666666" p-id="3533"></path><path d="M682.666667 480h-138.666667V341.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v138.666667H341.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h138.666667V682.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-138.666667H682.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" fill="#666666" p-id="3534"></path></svg>
    </button>
</template>

<script lang="ts" setup>

const props = defineProps({
  text: {
    type: String,
    default: '添加标签',
  },
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
  .Btn {
    width: 130px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(15, 15, 15);
    border: none;
    color: white;
    font-weight: 600;
    gap: 8px;
    cursor: pointer;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.103);
    position: relative;
    overflow: hidden;
    transition-duration: .3s;
  }

  .svgIcon {
    width: 16px;
  }

  .svgIcon path {
    fill: white;
  }

  .Btn::before {
    width: 130px;
    height: 130px;
    position: absolute;
    content: "";
    background-color: white;
    border-radius: 50%;
    left: -130%;
    top: 0;
    transition-duration: .3s;
    mix-blend-mode: difference;
  }

  .Btn:hover::before {
    transition-duration: .3s;
    transform: translate(100%,-50%);
    border-radius: 0;
  }

  .Btn:active {
    transform: translate(5px,5px);
    transition-duration: .3s;
  }
</style>
