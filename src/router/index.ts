import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';  // 引入 Pinia 的 auth store

import HomePage from '@/pages/HomePage.vue';
import SearchPage from '@/pages/Search/SearchPage.vue';
import CommunicationPage from '@/pages/Communication/CommunicationList.vue';
import DailyPoemPage from '@/pages/DailyPoemPage.vue';
import PersonalCenterPage from '@/pages/PersonalCenterPage.vue';
import WritePoemPage from '@/pages/UserPoem/WritePoemPage.vue';
import PoemExplanationPage from '@/pages/Explanation/PoemExplanationList.vue';
import LoginPage from '@/pages/LoginPage.vue';
import PoemExplanationDetailPage from '@/pages/Explanation/PoemExplanationDetailPage.vue';
import NotFoundPage from '@/pages/NotFound/NotFoundPage.vue';
import CreatePoemExplanation from '@/pages/Explanation/CreatePoemExplanation.vue';
import UserPoemList from '@/pages/UserPoem/UserPoemList.vue';
import UserPoemDetail from '@/pages/UserPoem/UserPoemDetail.vue';
import SearchResultsPage from '@/pages/Search/SearchResultsPage.vue';
import CommunicationDetailPage from '@/pages/Communication/CommunicationDetailPage.vue';
import CreateCommunication from '@/pages/Communication/CreateCommunication.vue';
import RecitationList from '@/pages/Recitation/RecitationList.vue';
import RecitationDetailPage from '@/pages/Recitation/RecitationDetailPage.vue';
import CreateRecitation from '@/pages/Recitation/CreateRecitation.vue';
import PoetPoemListPage from '@/pages/PoetPoem/PoetPoemListPage.vue';
import PoetPoemDetailPage from '@/pages/PoetPoem/PoetPoemDetailPage.vue';
import TestPlay from '@/pages/TestPlay.vue';

const routes = [
  {
    path: '/',
    component: HomePage,
    name: 'Home',
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
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/write-poem',
    component: WritePoemPage,
    name: 'WritePoem',
    meta: {
      title: '创作诗歌',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/recitation',
    name: 'RecitationList',
    component: RecitationList,
    meta: {
      title: '诗歌朗诵',
    },
  },
  {
    path: '/recitation/:recitationId',
    component: RecitationDetailPage,
    name: 'RecitationDetail',
    props: true,
    meta: {
      title: '朗读详情',
    },
  },
  {
    path: '/create-recitation',
    component: CreateRecitation,
    name: 'CreateRecitation',
    meta: {
      title: '创建朗读',
      requiresAuth: true,
    },
  },
  {
    path: '/poem-explanation',
    component: PoemExplanationPage,
    name: 'PoemExplanationList',
    meta: {
      title: '诗歌解析',
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
    name: 'Communication',
    meta: {
      title: '诗歌交流',
    },
  },
  {
    path: '/communication/:postId',
    name: 'CommunicationDetail',
    component: CommunicationDetailPage,
    props: true
  },
  {
    path: '/poet-poem-list',
    component: PoetPoemListPage,
    name: 'PoetPoemList',
    meta: {
      title: '诗歌列表',
    },
  },
  {
    path: '/poet-poem-detail/:poemId',
    component: PoetPoemDetailPage,
    name: 'PoetPoemDetail',
    props: true,
    meta: {
      title: '诗歌详情',
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
    path: '/search-result',
    component: SearchResultsPage,
    name: 'SearchResultsPage',
    meta: {
      title: '搜索结果',
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
    path: '/create-communication',
    component: CreateCommunication,
    name: 'CreateCommunication',
    meta: {
      title: '创建诗歌交流',
      requiresAuth: true,
    },
  },
  {
    path: '/user-poem-list',
    component: UserPoemList,
    name: 'UserPoemList',
    meta: {
      title: '用户诗歌列表',
    },
  },
  {
    path: '/user-poem-detail/:poemId',
    component: UserPoemDetail,
    name: 'UserPoemDetail',
    props: true,
    meta: {
      title: '用户诗歌详情',
    },
  },
  {
    path: '/test/just-for-test',
    component: TestPlay,
    name: 'TestPlay',
    meta: {
      title: '测试页面',
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
