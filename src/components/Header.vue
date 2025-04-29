<template>
  <header 
    class="fixed top-0 left-0 w-full z-50 transition-colors duration-300 flex items-center justify-center"
    :class="{ 'bg-white shadow': isScrolled, 'bg-transparent': !isScrolled }"
    :style="{ height: '64px' }"
  >
    <nav class="w-full mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-6" aria-label="Global">
      <!-- Logo and Brand -->
      <div class="flex lg:flex-1 items-center">
        <router-link to="/" class="flex items-center p-1.5">
          <img src="/loading.gif" alt="Meorin" class="h-6 w-auto mr-3 sm:h-8" />
          <span class="font-bold text-base sm:text-xl">诗韵Poemre</span>
        </router-link>
      </div>
      
      <!-- Mobile menu button -->
      <div class="flex items-center lg:hidden">
        <button 
          type="button" 
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 mr-2" 
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
            class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 outline-none"
            :class="{ 'text-gray-900': isScrolled, 'text-gray-800': !isScrolled }"
          >
            <AppstoreOutlined class="h-5 w-5 text-orange-400" aria-hidden="true" />
            诗歌交流
            <ChevronDownIcon 
              class="h-5 w-5 flex-none text-gray-400 transition-transform" 
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
            <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div 
                  v-for="item in navigationItems" 
                  :key="item.name" 
                  class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                >
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

        <!-- 替换常规导航链接：每日一诗 下拉菜单 -->
        <Popover v-slot="{ open }" class="relative">
          <PopoverButton class="flex items-center gap-x-2 text-sm font-semibold leading-6" :class="{ 'text-gray-900': isScrolled, 'text-gray-800': !isScrolled }">
            <GlobalOutlined class="h-5 w-5 text-blue-400" aria-hidden="true" />
            每日一诗
            <ChevronDownIcon class="h-5 w-5 text-gray-400 transition-transform" :class="{ 'rotate-180': open }" aria-hidden="true" />
          </PopoverButton>
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
            <PopoverPanel class="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
              <div class="p-4">
                <div v-for="item in dailyMenuItems" :key="item.name" class="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50">
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

        <router-link 
          to="/user-poem-list" 
          class="flex items-center gap-x-2 text-sm font-semibold leading-6"
          :class="{ 'text-gray-900': isScrolled, 'text-gray-800': !isScrolled }"
        >
          <LikeFilled class="h-5 w-5 text-pink-400" aria-hidden="true" />
          诗词创作花园
        </router-link>

        <!-- Search Icon -->
        <router-link 
          to="/search" 
          class="text-gray-700 hover:text-gray-900 ml-4 flex items-center"
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
              class="h-8 w-8 rounded-full object-cover border border-gray-200"
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
              class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              style="top: 100%;"
            >
              <router-link 
                to="/personal-center" 
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeUserMenu"
              >
                个人中心
              </router-link>
              <button 
                class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleLogout"
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
          :class="{ 'text-gray-900': isScrolled, 'text-gray-800': !isScrolled }"
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
      :open="mobileMenuOpen" 
      @close="mobileMenuOpen = false"
    >
      <div class="fixed inset-0 z-50" />
      <DialogPanel class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center -m-1.5 p-1.5" @click="mobileMenuOpen = false">
            <img src="/loading.gif" alt="Meorin" class="h-8 w-auto mr-2" />
            <span class="font-bold text-lg">诗韵Poemre</span>
          </router-link>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <!-- Mobile Navigation Items -->
              <div class="py-4">
                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <AppstoreOutlined class="h-5 w-5 text-orange-400 mr-2" />
                  诗歌交流
                </h3>
                <div class="space-y-2 pl-6">
                  <router-link
                    v-for="item in navigationItems"
                    :key="item.name"
                    :to="item.href"
                    class="block rounded-lg py-2 pl-3 pr-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    @click="mobileMenuOpen = false"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
              <!-- 使用 dailyMenuItems 数组支持多跳转项 -->
              <div class="space-y-2">
                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                  <GlobalOutlined class="h-5 w-5 text-orange-400 mr-2" />
                  每日体验
                </h3>
                <div class="space-y-2 pl-6">
                  <router-link
                    v-for="item in dailyMenuItems"
                    :key="item.name"
                    :to="item.href"
                    class="block rounded-lg py-2 pl-3 pr-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    @click="mobileMenuOpen = false"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
              <router-link
                to="/user-poem-list"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                @click="mobileMenuOpen = false"
              >
                <LikeFilled class="h-5 w-5 text-pink-400 mr-2" />
                诗词创作花园
              </router-link>
              
              <router-link
                to="/search"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
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
                  class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  @click="mobileMenuOpen = false"
                >
                  <img 
                    :src="userAvatar" 
                    alt="User Avatar" 
                    class="h-8 w-8 rounded-full object-cover mr-3 border border-gray-200"
                  />
                  个人中心
                </router-link>
                <button
                  class="flex w-full items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  @click="handleLogoutMobile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </button>
              </div>
              <router-link
                v-else
                to="/login"
                class="flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/vue'
import { Bars3Icon, ChevronDownIcon, SparklesIcon, StarIcon } from '@heroicons/vue/24/outline'
import { GlobalOutlined, AppstoreOutlined, LikeFilled, SearchOutlined, SoundTwotone, UserDeleteOutlined, QuestionCircleOutlined, BookOutlined } from '@vicons/antd'
import { useAuthStore } from '@/store/auth'
import { logout } from '@/api/auth'
import { showPrompt } from '@/components/functions/prompt'

const DEFAULT_AVATAR = '/default-avatar.png'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const isScrolled = ref(false)
const router = useRouter()

// Navigation items
const navigationItems = [
  { name: '诗歌解读', description: '横看成岭侧成峰，远近高低各不同', href: '/poem-explanation', icon: SparklesIcon },
  { name: '日常交流', description: '尘世难逢开口笑，菊花须插满头归', href: '/communication', icon: StarIcon },
  { name: '诗歌朗读', description: '闲事愁人人易老，得高歌处且高歌', href: '/recitation', icon: SoundTwotone },
  { name: '诗歌列表', description: '千古诗词浩如烟，文人墨客竞翩跹', href: '/poet-poem-list', icon: GlobalOutlined}
]

const dailyMenuItems = ref([
  { name: '每日一诗', description: '每日精选诗词，停下脚步，细品诗意', href: '/daily-poem', icon: BookOutlined },
  { name: '每日一题', description: '每日精选题目，启迪思维，挑战自我', href: '/answer-question', icon: QuestionCircleOutlined}
])

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
  router.push('/')
  showPrompt('success','退出登录成功，下次见哦。')
}

// Event handlers for detecting clicks outside
const handleClickOutside = (event: any) => {
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
}

a, button {
  display: flex;
  align-items: center;
}
</style>
