<template>
  <header class="bg-white fixed top-0 left-0 w-full z-50">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <router-link to="/" class="flex items-center -m-1.5 p-1.5">
          <img src="/loading.gif" alt="Meorin" class="h-8 w-auto mr-4" />
          <span class="font-bold" style="font-size: 20px;">Meorin的小站</span>
        </router-link>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <Popover class="relative">
          <PopoverButton class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
            <AppstoreOutlined class="h-5 w-5 text-orange-400" aria-hidden="true" />
            一些小玩意
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

        <router-link to="/travel-diary" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <GlobalOutlined class="h-5 w-5 text-blue-400" aria-hidden="true" />
          旅行日记
        </router-link>
        <router-link to="/personal-status" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <UserDeleteOutlined class="h-5 w-5 text-green-400" aria-hidden="true" />
          个人动态
        </router-link>
        <router-link to="/my-oshi" class="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900">
          <LikeFilled class="h-5 w-5 text-pink-400" aria-hidden="true" />
          我推！
        </router-link>
      </PopoverGroup>
    </nav>
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <router-link to="/" class="-m-1.5 p-1.5">
            <img src="/loading.gif" alt="Meorin" class="h-8 w-auto mr-4" />
            <span class = "text-l font-semibold">Meorin的小站</span>
          </router-link>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <Disclosure as="div" class="-mx-3" v-slot="{ open }">
                <DisclosureButton class="flex items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                  <div class="flex items-center gap-x-2">
                    <AppstoreOutlined class="w-5 h-5 text-orange-400" aria-hidden="true" />
                    Product
                  </div>
                  <ChevronDownIcon :class="[open ? 'rotate-180' : '', 'h-5 w-5 flex-none']" aria-hidden="true" />
                </DisclosureButton>
                <DisclosurePanel class="mt-2 space-y-2">
                  <router-link v-for="item in [...products]" :key="item.name" :to="item.href" class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                    {{ item.name }}
                  </router-link>
                </DisclosurePanel>
              </Disclosure>
              <router-link to="/travel-diary" class="-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                <GlobalOutlined class="h-5 w-5 text-blue-400" aria-hidden="true" />
                旅行日记
              </router-link>
              <router-link to="/personal-status" class="-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                <UserDeleteOutlined class="h-5 w-5 text-green-400" aria-hidden="true" />
                个人动态
              </router-link>
              <router-link to="/my-oshi" class="-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                <LikeFilled class="h-5 w-5 text-pink-400" aria-hidden="true" />
                我推！
              </router-link>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Popover, PopoverButton, PopoverGroup, PopoverPanel,} 
from '@headlessui/vue'

import { Bars3Icon, XMarkIcon, ChevronDownIcon, PaperAirplaneIcon,  SparklesIcon, StarIcon, } 
from '@heroicons/vue/24/outline'

import { GlobalOutlined, AppstoreOutlined, UserDeleteOutlined, LikeFilled } 
from '@vicons/antd'

const products = [
  { name: '漂流瓶', description: '今天可以收到什么消息呢？', href: '/drift-bottles', icon: PaperAirplaneIcon },
  { name: '今日运势', description: '测测今天的运势吧~', href: '/daily-fortune', icon: SparklesIcon },
  { name: '有罕见？', description: '我去，有罕见！', href: '/dongxuelian', icon: StarIcon },
]

const mobileMenuOpen = ref(false)
</script>

<script>
export default {
  name: 'Header',
}
</script>
