<template>
    <h1 class="title dark:text-gray-100" data-text="Awesome Title">
      <span class="actual-text">&nbsp;{{ text }}&nbsp;</span>
      <span aria-hidden="true" class="hover-text">&nbsp;{{ text }}&nbsp;</span>
    </h1>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Animated Title"
    }
  }
}
</script>
  
<style scoped>
  .title {
    margin: 0;
    padding: 0;
    line-height: 1;
    --animation-color: #ffb937;
    --fs-size: 2rem;
    letter-spacing: 3px;
    font-size: var(--fs-size);
    font-family: "Arial", sans-serif;
    text-transform: uppercase;
    position: relative;
    display: inline-block;
    -webkit-text-stroke: 1px var(--text-stroke-color);
  }
  
  /* 悬停动画效果 */
  .hover-text {
    position: absolute;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: 6px solid var(--animation-color);
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    transition: 0.5s;
    -webkit-text-stroke: 1px var(--animation-color);
  }
  
  .title:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }

  </style>