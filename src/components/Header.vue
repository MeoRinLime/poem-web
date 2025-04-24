<template>
  <header 
    class="fixed top-0 left-0 w-full z-50 transition-colors duration-300 flex items-center justify-center"
    :class="{ 'bg-white shadow': isScrolled, 'bg-transparent': !isScrolled, 'dark:bg-gray-900': isDarkMode && isScrolled }"
    :style="{ height: '64px' }"
  >
    <nav class="w-full mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-6" aria-label="Global">
      <!-- Logo and Brand with Dark Mode Toggle -->
      <div class="flex lg:flex-1 items-center">
        <router-link to="/" class="flex items-center p-1.5">
          <img src="/loading.gif" alt="Meorin" class="h-6 w-auto mr-3 sm:h-8" />
          <span class="font-bold text-base sm:text-xl text-gray-900 dark:text-white">诗韵Poemre</span>
        </router-link>
        
        <!-- Dark Mode Toggle Button -->
        <button
          @click="toggleDarkMode"
          class="ml-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="切换暗黑模式"
        >
          <span v-if="!isDarkMode" class="text-gray-700 text-sm">🌙</span>
          <span v-else class="text-yellow-300 text-sm">☀️</span>
        </button>
      </div>
      
      <!-- Mobile menu button -->
      <div class="flex items-center lg:hidden">
        <button 
          type="button" 
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300 mr-2" 
          aria-label="Toggle navigation menu"
          aria-expanded="false"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      
      <!-- Desktop navigation -->
      <PopoverGroup class="hidden lg:flex lg:gap-x-8 xl:gap-x-12 items-center justify-center">
        <!-- Poetry Exchange Dropdown -->
        <Popover v-slot="{ open }" class="relative">
          <PopoverButton 
            class="flex items-center gap-x-1 text-sm font-semibold leading-6 outline-none"
            :class="{ 'text-gray-900 dark:text-white': isScrolled, 'text-gray-800 dark:text-gray-200': !isScrolled }"
          >
            <AppstoreOutlined class="h-5 w-5 text-orange-400" aria-hidden="true" />
            诗歌交流
            <ChevronDownIcon 
              class="h-5 w-5 flex-none text-gray-400 dark:text-gray-500 transition-transform" 
              :class="{ 'rotate-180': open }"
              aria-hidden="true" 
            />
          </PopoverButton>
          <transition 
            enter-active-class="transition ease-out duration-200" 
            enter-from-class="opacity-0 translate-y-1" 
            enter-to-class="opacity-100 translate-y-0" 
            leave-active-class="transition ease-in duration-150" 
            leave-from-class="opacity-100 translate-y-0" 
            leave-to-class="opacity-0 translate-y-1"
          >
            <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700/50">
              <div class="p-4">
                <div 
                  v-for="item in navigationItems" 
                  :key="item.name" 
                  class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div class="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                    <component :is="item.icon" class="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" aria-hidden="true" />
                  </div>
                  <div class="flex-auto">
                    <router-link :to="item.href" class="block font-semibold text-gray-900 dark:text-white">
                      {{ item.name }}
                      <span class="absolute inset-0" />
                    </router-link>
                    <p class="mt-1 text-gray-600 dark:text-gray-300">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>

        <!-- Regular navigation links -->
        <router-link 
          to="/daily-poem" 
          class="flex items-center gap-x-2 text-sm font-semibold leading-6"
          :class="{ 'text-gray-900 dark:text-white': isScrolled, 'text-gray-800 dark:text-gray-200': !isScrolled }"
        >
          <GlobalOutlined class="h-5 w-5 text-blue-400" aria-hidden="true" />
          每日一诗
        </router-link>
        
        <router-link 
          to="/user-poem-list" 
          class="flex items-center gap-x-2 text-sm font-semibold leading-6"
          :class="{ 'text-gray-900 dark:text-white': isScrolled, 'text-gray-800 dark:text-gray-200': !isScrolled }"
        >
          <LikeFilled class="h-5 w-5 text-pink-400" aria-hidden="true" />
          创作
        </router-link>

        <!-- Search Icon -->
        <router-link 
          to="/search" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-4 flex items-center"
          aria-label="搜索"
        >
          <SearchButton class="h-6 w-6" />
        </router-link>

        <!-- User Avatar and Dropdown (Logged in) -->
        <div v-if="authStore.isLoggedIn" class="relative ml-4 flex items-center">
          <button 
            class="flex items-center focus:outline-none" 
            aria-expanded="userMenuOpen"
            aria-label="User menu"
            @click="toggleUserMenu"
          >
            <img 
              :src="userAvatar" 
              alt="User Avatar" 
              class="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
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
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5"
              style="top: 100%;"
            >
              <router-link 
                to="/personal-center" 
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="closeUserMenu"
              >
                个人中心
              </router-link>
              <button 
                @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                退出登录
              </button>
            </div>
          </transition>
        </div>

        <!-- Login Link (Not logged in) -->
        <router-link 
          v-else 
          to="/login" 
          class="flex items-center gap-x-2 text-sm font-semibold leading-6"
          :class="{ 'text-gray-900 dark:text-white': isScrolled, 'text-gray-800 dark:text-gray-200': !isScrolled }"
        >
          <UserDeleteOutlined class="h-5 w-5 text-green-400" aria-hidden="true" />
          登录
        </router-link>
      </PopoverGroup>
    </nav>

    <!-- Mobile menu dialog -->
    <Dialog 
      as="div"
      class="lg:hidden" 
      @close="mobileMenuOpen = false" 
      :open="mobileMenuOpen"
    >
      <div class="fixed inset-0 z-50" />
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-700/50">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center -m-1.5 p-1.5" @click="mobileMenuOpen = false">
            <img src="/loading.gif" alt="Meorin" class="h-8 w-auto mr-2" />
            <span class="font-bold text-lg text-gray-900 dark:text-white">诗韵Poemre</span>
          </router-link>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/50">
            <div class="space-y-2 py-6">
              <!-- Mobile Navigation Items -->
              <div class="py-4">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <AppstoreOutlined class="h-5 w-5 text-orange-400 mr-2" />
                  诗歌交流
                </h3>
                <div class="space-y-2 pl-6">
                  <router-link
                    v-for="item in navigationItems"
                    :key="item.name"
                    :to="item.href"
                    class="block rounded-lg py-2 pl-3 pr-3 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    @click="mobileMenuOpen = false"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
              
              <router-link
                to="/daily-poem"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="mobileMenuOpen = false"
              >
                <GlobalOutlined class="h-5 w-5 text-blue-400 mr-2" />
                每日一诗
              </router-link>
              
              <router-link
                to="/user-poem-list"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="mobileMenuOpen = false"
              >
                <LikeFilled class="h-5 w-5 text-pink-400 mr-2" />
                创作
              </router-link>
              
              <router-link
                to="/search"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="mobileMenuOpen = false"
              >
                <SearchOutlined class="h-5 w-5 mr-2" />
                搜索
              </router-link>
            </div>
            
            <div class="py-6">
              <!-- Profile section for mobile -->
              <div v-if="authStore.isLoggedIn" class="space-y-2">
                <router-link
                  to="/personal-center"
                  class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  @click="mobileMenuOpen = false"
                >
                  <img 
                    :src="userAvatar" 
                    alt="User Avatar" 
                    class="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-600"
                  />
                  个人中心
                </router-link>
                <button
                  @click="handleLogoutMobile"
                  class="flex w-full items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </div>
              <router-link
                v-else
                to="/login"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                @click="mobileMenuOpen = false"
              >
                <UserDeleteOutlined class="h-5 w-5 text-green-400 mr-2" />
                登录
              </router-link>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue'
import { Bars3Icon, ChevronDownIcon, PaperAirplaneIcon, SparklesIcon, StarIcon } from '@heroicons/vue/24/outline'
import { GlobalOutlined, AppstoreOutlined, LikeFilled, SearchOutlined, UserDeleteOutlined } from '@vicons/antd'
import { useAuthStore } from '@/store/auth'
import { logout } from '@/api/auth'
import { useMessage } from 'naive-ui'
import router from '@/router'
import { getUserAvatar } from '@/api/personalCenter'

const message = useMessage()
const DEFAULT_AVATAR = '/default-avatar.png'

// State variables
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const isScrolled = ref(false)
const isDarkMode = ref(false)

// Navigation items
const navigationItems = [
  { name: '诗歌解读', description: '横看成岭侧成峰，远近高低各不同', href: '/poem-explanation', icon: SparklesIcon },
  { name: '日常交流', description: '尘世难逢开口笑，菊花须插满头归', href: '/communication', icon: StarIcon },
  { name: '诗歌朗读', description: '闲事愁人人易老，得高歌处且高歌', href: '/recitation', icon: PaperAirplaneIcon },
  { name: '诗歌列表', description: '千古诗词浩如烟，文人墨客竞翩跹', href: 'poem-list', icon: GlobalOutlined }
]

// Computed properties
const userAvatar = computed(() => {
  return authStore.avatar || DEFAULT_AVATAR
})

// Methods
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Dark Mode Toggle
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'light')
  }
}

// Initialize Dark Mode
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedMode === 'dark' || (!savedMode && systemPrefersDark)) {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }
}

const handleLogout = () => {
  performLogout()
  closeUserMenu()
}

const handleLogoutMobile = () => {
  performLogout()
  mobileMenuOpen.value = false
}

const performLogout = () => {
  authStore.logout()
  logout()
  message.success('退出登录成功，下次见哦。')
  router.push('/')
}

// Event handlers for detecting clicks outside
const handleClickOutside = (event) => {
  const userMenuElement = event.target.closest('.relative')
  if (!userMenuElement && userMenuOpen.value) {
    closeUserMenu()
  }
}

// Lifecycle hooks
onMounted(() => {  
  // Add event listeners
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
  
  // Initial check for scroll position
  handleScroll()
  
  // Initialize dark mode
  initializeDarkMode()
})

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  @apply transition-colors duration-300;
}

/* 确保所有链接和按钮在垂直方向上居中 */
a, button {
  display: flex;
  align-items: center;
}

/* 暗黑模式下的滚动条样式 */
.dark ::-webkit-scrollbar {
  width: 8px;
}
.dark ::-webkit-scrollbar-track {
  @apply bg-gray-800;
}
.dark ::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded-full;
}
.dark ::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style>