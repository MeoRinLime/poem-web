<template>
  <header class="bg-white fixed top-0 left-0 w-full z-50">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1 items-center">
        <router-link to="/" class="flex items-center -m-1.5 p-1.5">
          <img src="/loading.gif" alt="Meorin" class="h-8 w-auto mr-4" />
          <span class="font-bold" style="font-size: 20px;">诗韵Poemre</span>
        </router-link>
      </div>
      
      <div class="flex items-center lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 mr-2" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      
      <PopoverGroup class="hidden lg:flex lg:gap-x-12 items-center">
        <Popover class="relative">
          <PopoverButton class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            <AppstoreOutlined class="h-5 w-5 text-orange-400" aria-hidden="true" />
            诗歌交流
            <ChevronDownIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </PopoverButton>
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in products" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
                  <div class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <router-link :to="item.href" class="block font-semibold text-gray-900">
                      {{ item.name }}
                      <span class="absolute inset-0" />
                    </router-link>
                    <p class="mt-1 text-gray-600">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>

        <router-link to="/daily-poem" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <GlobalOutlined class="h-5 w-5 text-blue-400" aria-hidden="true" />
          每日一诗
        </router-link>
        <router-link to="/personal-center" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <UserDeleteOutlined class="h-5 w-5 text-green-400" aria-hidden="true" />
          个人中心
        </router-link>
        <router-link to="/write-poem" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <LikeFilled class="h-5 w-5 text-pink-400" aria-hidden="true" />
          创作
        </router-link>

        <!-- 搜索 -->
        <router-link 
          to="/search" 
          class="text-gray-700 hover:text-gray-900 ml-4"
        >
          <SearchOutlined class="h-6 w-6" />
        </router-link>
      </PopoverGroup>

      <!-- 移动设备搜索 -->
      <div class="lg:hidden">
        <router-link 
          to="/search" 
          class="text-gray-700 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </router-link>
      </div>
    </nav>

    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <!-- Mobile menu dialog remains the same -->
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <!-- ... (previous mobile menu content) ... -->
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } 
from '@headlessui/vue'

import { Bars3Icon, XMarkIcon, ChevronDownIcon, PaperAirplaneIcon, SparklesIcon, StarIcon } 
from '@heroicons/vue/24/outline'

import { GlobalOutlined, AppstoreOutlined, UserDeleteOutlined, LikeFilled, SearchOutlined } 
from '@vicons/antd'

const products = [
  { name: '朗读专区', description: '白日放歌须纵酒，青春作伴好还乡', href: '/read-aloud', icon: PaperAirplaneIcon },
  { name: '诗歌解读', description: '横看成岭侧成峰，远近高低各不同', href: '/poem-explanation', icon: SparklesIcon },
  { name: '日常交流', description: '尘世难逢开口笑，菊花须插满头归', href: '/communication', icon: StarIcon },
]

const mobileMenuOpen = ref(false)
</script>

<script>
export default {
  name: 'Header',
}
</script>