import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import Blog from '@/components/Blog.vue'
import SearchPage from '@/pages/SearchPage.vue'
import CommunicationPage from '@/pages/CommunicationPage.vue'
import DailyPoemPage from '@/pages/DailyPoemPage.vue'
import PersonalCenterPage from '@/pages/PersonalCenterPage.vue'
import WritePoemPage from '@/pages/WritePoemPage.vue'
import ReadAloudPage from '@/pages/ReadAloudPage.vue'
import PoemExplanationPage from '@/pages/PoemExplanationPage.vue'

const routes = [
  {
    path: '/',
    component: HomePage,
    meta: {
      title: '主页',
    },
  },
  {
    path: '/daily-poem',
    component: DailyPoemPage,
    meta: {
      title: '每日一诗推荐',
    },
  },
  {
    path: '/personal-center',
    component: PersonalCenterPage,
    meta: {
      title: '个人中心',
    },
  },
  {
    path: '/write-poem',
    component: WritePoemPage,
    meta: {
      title: '创作诗歌',
    },
  },
  // {
  //   path: '/travel-diary/:title',
  //   component: Blog,
  //   meta: {
  //     title: '文章详情',
  //   },
  // },
  {
    path: '/read-aloud',
    component: ReadAloudPage,
    meta: {
      title: '诗歌朗诵',
    },
  },
  {
    path: '/poem-explanation',
    component: PoemExplanationPage,
    meta: {
      title: '诗歌解析',
    },
  },
  {
    path: '/communication',
    component: CommunicationPage,
    meta: {
      title: '诗歌交流',
    },
  },
  {
    path: '/search',
    component: SearchPage,
    meta: {
      title: '搜索',
    },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
