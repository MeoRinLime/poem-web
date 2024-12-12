<script setup lang="ts">
import { ref } from 'vue'
import { SearchOutlined } from '@vicons/antd'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      name: 'SearchResultsPage', 
      // eslint-disable-next-line id-length
      query: { keyWord: searchQuery.value.trim() } 
    })
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <div class="mb-8 text-center mt-36">
      <h1 class="text-5xl font-thin text-gray-600">
        <span class="text-blue-500">P</span>
        <span class="text-red-500">o</span>
        <span class="text-yellow-500">e</span>
        <span class="text-blue-500">m</span>
        <span class="text-green-500">r</span>
        <span class="text-red-500">e</span>
      </h1>
    </div>

    <div class="w-full max-w-xl relative">
      <div class="flex items-center border rounded-full shadow-md hover:shadow-lg transition-shadow">
        <div class="relative flex-grow">
          <SearchOutlined 
            class="absolute top-3 left-2 w-7 text-gray-500 cursor-pointer" 
            @click="handleSearch"
            />
          <input 
            v-model="searchQuery" 
            type="text"
            placeholder="今天想知道些什么呢？" 
            class="w-full p-3 pl-10 outline-none rounded-full"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>