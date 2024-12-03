import { createRouter, createWebHistory } from 'vue-router'

import path from 'path'
import HomePage from '@/pages/HomePage.vue'
import MyOshiPage from '@/pages/MyOshiPage.vue'
import HanjianPage from '@/pages/HanjianPage.vue'
import BlogsPage from '@/pages/BlogsPage.vue'
import Blog from '@/components/Blog.vue'
import PersonalInformationPage from '@/pages/PersonalInformationPage.vue'
import DriftBottlesPage from '@/pages/DriftBottlesPage.vue'
import DailyFortunePage from '@/pages/DailyFortunePage.vue'

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: {
      title: '主页',
    },
  },
  {
    path: '/my-oshi',
    component: MyOshiPage,
    meta: {
      title: '推し活',
    },
  },
  {
    path: '/dongxuelian',
    component: HanjianPage,
    meta: {
      title: '我去！有罕见！',
    },
  },
  {
    path: '/travel-diary',
    component: BlogsPage,
    meta: {
      title: '旅行日记',
    },
  },
  {
    path: '/travel-diary/:title',
    component: Blog,
    meta: {
      title: '文章详情',
    },
  },
  {
    path: '/personal-status',
    component: PersonalInformationPage,
    meta: {
      title: 'Meorin的个人动态',
    },
  },
  {
    path: '/drift-bottles',
    component: DriftBottlesPage,
    meta: {
      title: '漂流瓶',
    },
  },
  {
    path: '/daily-fortune',
    component: DailyFortunePage,
    meta: {
      title: '每日运势',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
