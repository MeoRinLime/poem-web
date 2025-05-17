<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <div class="mb-8 text-center mt-36">
      <h1 class="text-5xl font-thin text-gray-600 dark:text-gray-300">
        <span class="text-blue-500">P</span>
        <span class="text-red-500">o</span>
        <span class="text-yellow-500">e</span>
        <span class="text-blue-500">m</span>
        <span class="text-green-500">r</span>
        <span class="text-red-500">e</span>
      </h1>
    </div>

    <div class="w-full max-w-xl relative">
      <div class="flex items-center border dark:border-gray-700 rounded-full shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800">
        <div class="relative flex-grow">
          <SearchOutlined 
            class="absolute top-3 left-2 w-7 text-gray-500 dark:text-gray-400 cursor-pointer" 
            @click="handleSearch"
          />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="今天想知道些什么呢？"
            class="w-full p-3 pl-10 outline-none rounded-full dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
            @keyup.enter="handleSearch"
            @input="onInput"
          />
          <!-- 联想建议下拉框 -->
          <ul
            v-if="suggestions.length"
            class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg mt-1 max-h-60 overflow-auto z-10 shadow-lg"
          >
            <li
              v-for="(item, idx) in suggestions"
              :key="idx"
              class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer dark:text-gray-200"
              @click="selectSuggestion(item)"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { SearchOutlined } from '@vicons/antd'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const suggestions = ref<string[]>([])
const router = useRouter()
let socket: WebSocket

// 生成一个简单的客户端标识 sid
function generateSid(): string {
  return Math.random().toString(36).substring(2, 8)
}

// 建立 WebSocket 连接（直接用 ws://localhost:8000）
onMounted(() => {
  const sid = generateSid()
  const url = `ws://api.meorin.top/webSocket/${sid}`
  console.log('[WS] connecting to', url)
  socket = new WebSocket(url)

  socket.onopen = () => console.log('[WS] connected')
  socket.onerror = (err) => console.error('[WS] error', err)
  socket.onclose = (evt) => console.log('[WS] closed', evt.code, evt.reason)
  socket.onmessage = (event) => {
    console.log('[WS] recv:', event.data)
    try {
      const resp: SocketMsg = JSON.parse(event.data)
      if (resp.msgType === 'INFO') {
        const dtos: Array<{ suggestion: string }> = JSON.parse(resp.msg)
        suggestions.value = dtos.map(d => d.suggestion)
      }
    } catch (error) {
      console.error('解析联想建议失败', error)
    }
  }
})

// 组件销毁时关闭 WebSocket
onBeforeUnmount(() => {
  socket.close()
})

// 输入时立即发送关键词
const onInput = () => {
  const kw = searchQuery.value.trim()
  if (kw && socket.readyState === WebSocket.OPEN) {
    console.log('[WS] send:', kw)
    socket.send(JSON.stringify({ msg: kw, msgType: 'INFO' }))
  } else {
    suggestions.value = []
  }
}

const selectSuggestion = (text: string) => {
  searchQuery.value = text
  suggestions.value = []
  handleSearch()
}

const handleSearch = () => {
  const kw = searchQuery.value.trim()
  if (kw) {
    router.push({
      name: 'SearchResultsPage',
      query: { keyWord: kw }
    })
  }
}

interface SocketMsg {
  msg: string;
  msgType: 'CONNECT' | 'CLOSE' | 'INFO' | 'ERROR';
}
</script>

<style scoped>
/* 根据需要微调样式 */
</style>
