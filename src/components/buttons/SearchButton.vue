<template>
    <button class="Btn">
      <div class="sign"><svg t="1744737525072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1595" width="200" height="200"><path d="M456.5504 51.2a405.3504 405.3504 0 0 1 315.2384 660.1216l156.672 156.7744a42.6496 42.6496 0 0 1-55.9616 64.1536l-4.4032-3.7888-156.7744-156.672A405.3504 405.3504 0 1 1 456.4992 51.2z m0 85.3504a320 320 0 1 0 0 640 320 320 0 0 0 0-640z" fill="#333333" p-id="1596"></path></svg></div>
      <div class="text">搜索</div>
    </button>
</template>
  
<style scoped>
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: .3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: rgb(65, 65, 255);
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: .3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1em;
    font-weight: 600;
    transition-duration: .3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: .3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: .3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: .3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px ,2px);
  }
</style>
