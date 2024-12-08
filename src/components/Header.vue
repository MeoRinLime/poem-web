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

        <!-- 用户头像和下拉菜单 -->
        <div class="relative" v-if="authStore.isLoggedIn">
          <button 
            @click="toggleUserMenu" 
            class="flex items-center focus:outline-none"
          >
            <img 
              :src="userAvatar" 
              alt="User Avatar" 
              class="h-8 w-8 rounded-full object-cover"
            />
          </button>
          
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div 
              v-if="userMenuOpen" 
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <router-link 
                to="/personal-center" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="toggleUserMenu"
              >
                个人中心
              </router-link>
              <button 
                @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                退出登录
              </button>
            </div>
          </transition>
        </div>

        <!-- 未登录时的个人中心入口 -->
        <router-link 
          v-else 
          to="/login" 
          class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900"
        >
          <UserDeleteOutlined class="h-5 w-5 text-green-400" aria-hidden="true" />
          登录
        </router-link>
      </PopoverGroup>
    </nav>

    <!-- Mobile menu dialog remains the same as in the original code -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <!-- Mobile menu content -->
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue'
import { Bars3Icon, ChevronDownIcon, PaperAirplaneIcon, SparklesIcon, StarIcon } from '@heroicons/vue/24/outline'
import { GlobalOutlined, AppstoreOutlined, LikeFilled, SearchOutlined, UserDeleteOutlined } from '@vicons/antd'
import { useAuthStore } from '@/store/auth' // 使用提供的 auth store
import { logout } from '@/api/auth'

const DEFAULT_AVATAR = '/default-avatar.png'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const products = [
  { name: '朗读专区', description: '白日放歌须纵酒，青春作伴好还乡', href: '/read-aloud', icon: PaperAirplaneIcon },
  { name: '诗歌解读', description: '横看成岭侧成峰，远近高低各不同', href: '/poem-explanation', icon: SparklesIcon },
  { name: '日常交流', description: '尘世难逢开口笑，菊花须插满头归', href: '/communication', icon: StarIcon },
]

// 计算用户头像，如果没有则使用默认头像
const userAvatar = computed(() => {
  // 这里可以根据实际需求从用户信息中获取头像
  // 目前使用默认头像，可以根据实际情况修改
  return DEFAULT_AVATAR
})

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  authStore.logout()
  logout()
  userMenuOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const userMenuElement = event.target.closest('.relative')
  if (!userMenuElement) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  // 初始化 auth store
  authStore.initialize()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<script>
export default {
  name: 'Header',
}
</script>