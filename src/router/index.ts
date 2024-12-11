import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';  // 引入 Pinia 的 auth store

import HomePage from '@/pages/HomePage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import CommunicationPage from '@/pages/CommunicationPage.vue';
import DailyPoemPage from '@/pages/DailyPoemPage.vue';
import PersonalCenterPage from '@/pages/PersonalCenterPage.vue';
import WritePoemPage from '@/pages/WritePoemPage.vue';
import ReadAloudPage from '@/pages/ReadAloudPage.vue';
import PoemExplanationPage from '@/pages/PoemExplanationPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import PoemExplanationDetailPage from '@/pages/PoemExplanationDetailPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CreatePoemExplanation from '@/pages/CreatePoemExplanation.vue';

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
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/personal-center',
    component: PersonalCenterPage,
    meta: {
      title: '个人中心',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/write-poem',
    component: WritePoemPage,
    meta: {
      title: '创作诗歌',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/read-aloud',
    component: ReadAloudPage,
    meta: {
      title: '诗歌朗诵',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/poem-explanation',
    component: PoemExplanationPage,
    name: 'PoemExplanationList',
    meta: {
      title: '诗歌解析',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/poem-explanation/:postId',
    name: 'PoemExplanationDetail',
    component: PoemExplanationDetailPage,
    props: true
  },
  {
    path: '/communication',
    component: CommunicationPage,
    meta: {
      title: '诗歌交流',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/search',
    component: SearchPage,
    meta: {
      title: '搜索',
      isFullscreen: false,
    },
  },
  {
    path: '/login',
    component: LoginPage,
    name : 'login',
    meta: {
      isFullscreen: true,
      title: '登录',
    },
  },
  {
    path: '/create-poem-explanation',
    component: CreatePoemExplanation,
    name: 'CreatePoemExplanation',
    meta: {
      title: '创建诗歌解析',
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: {
      title: '页面未找到',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();  // 获取 Pinia 中的 auth store

  // 如果目标路由需要登录权限（requiresAuth 为 true），且用户未登录
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isLoggedIn) {
    next({ name: 'login' });  // 跳转到登录页面
  } else {
    next();  // 继续访问
  }
});

export default router;
