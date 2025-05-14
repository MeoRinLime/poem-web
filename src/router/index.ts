import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';  // 引入 Pinia 的 auth store

const routes = [
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
    name: 'Home',
    meta: {
      title: '主页',
    },
  },
  {
    path: '/daily-poem',
    component: () => import('@/pages/DailyPoemPage.vue'),
    meta: {
      title: '每日一诗推荐',
    },
  },
  {
    path: '/answer-question',
    component: () => import('@/pages/AnswerQuestionPage.vue'),
    name: 'AnswerQuestions',
    meta: {
      title: '每日答题',
      isFullscreen: true,  // 全屏显示
    }
  },
  {
    path: '/personal-center',
    component: () => import('@/pages/PersonalCenterPage.vue'),
    name: 'PersonalCenter',
    meta: {
      title: '个人中心',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/personal-center/:username',
    component: () => import('@/pages/PersonalCenterPage.vue'),
    name: 'UserPersonalCenter',
    props: true,
    meta: {
      title: '用户中心',
    },
  },
  {
    path: '/write-poem',
    component: () => import('@/pages/UserPoem/WritePoemPage.vue'),
    name: 'WritePoem',
    meta: {
      title: '创作诗歌',
      requiresAuth: true,  // 需要登录才能访问
    },
  },
  {
    path: '/recitation',
    name: 'RecitationList',
    component: () => import('@/pages/Recitation/RecitationList.vue'),
    meta: {
      title: '诗歌朗诵',
    },
  },
  {
    path: '/recitation/:recitationId',
    component: () => import('@/pages/Recitation/RecitationDetailPage.vue'),
    name: 'RecitationDetail',
    props: true,
    meta: {
      title: '朗读详情',
    },
  },
  {
    path: '/create-recitation',
    component: () => import('@/pages/Recitation/CreateRecitation.vue'),
    name: 'CreateRecitation',
    meta: {
      title: '创建朗读',
      requiresAuth: true,
    },
  },
  {
    path: '/poem-explanation',
    component: () => import('@/pages/Explanation/PoemExplanationList.vue'),
    name: 'PoemExplanationList',
    meta: {
      title: '诗歌解析',
    },
  },
  {
    path: '/poem-explanation/:postId',
    name: 'PoemExplanationDetail',
    component: () => import('@/pages/Explanation/PoemExplanationDetailPage.vue'),
    props: true
  },
  {
    path: '/communication',
    component: () => import('@/pages/Communication/CommunicationList.vue'),
    name: 'Communication',
    meta: {
      title: '诗歌交流',
    },
  },
  {
    path: '/communication/:postId',
    name: 'CommunicationDetail',
    component: () => import('@/pages/Communication/CommunicationDetailPage.vue'),
    props: true
  },
  {
    path: '/poet-poem-list',
    component: () => import('@/pages/PoetPoem/PoetPoemListPage.vue'),
    name: 'PoetPoemList',
    meta: {
      title: '诗歌列表',
    },
  },
  {
    path: '/poet-poem-detail/:poemId',
    component: () => import('@/pages/PoetPoem/PoetPoemDetailPage.vue'),
    name: 'PoetPoemDetail',
    props: true,
    meta: {
      title: '诗歌详情',
    },
  },
  {
    path: '/search',
    component: () => import('@/pages/Search/SearchPage.vue'),
    meta: {
      title: '搜索',
      isFullscreen: false,
    },
  },
  {
    path: '/search-result',
    component: () => import('@/pages/Search/SearchResultsPage.vue'),
    name: 'SearchResultsPage',
    meta: {
      title: '搜索结果',
      isFullscreen: false,
    },
  },
  {
    path: '/login',
    component: () => import('@/pages/LoginPage.vue'),
    name : 'login',
    meta: {
      isFullscreen: true,
      title: '登录',
    },
  },
  {
    path: '/create-poem-explanation',
    component: () => import('@/pages/Explanation/CreatePoemExplanation.vue'),
    name: 'CreatePoemExplanation',
    meta: {
      title: '创建诗歌解析',
      requiresAuth: true,
    },
  },
  {
    path: '/create-communication',
    component: () => import('@/pages/Communication/CreateCommunication.vue'),
    name: 'CreateCommunication',
    meta: {
      title: '创建诗歌交流',
      requiresAuth: true,
    },
  },
  {
    path: '/user-poem-list',
    component: () => import('@/pages/UserPoem/UserPoemList.vue'),
    name: 'UserPoemList',
    meta: {
      title: '用户诗歌列表',
    },
  },
  {
    path: '/user-poem-detail/:poemId',
    component: () => import('@/pages/UserPoem/UserPoemDetail.vue'),
    name: 'UserPoemDetail',
    props: true,
    meta: {
      title: '用户诗歌详情',
    },
  },
  {
    path: '/test/just-for-test',
    component: () => import('@/pages/TestPlay.vue'),
    name: 'TestPlay',
    meta: {
      title: '测试页面',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound/NotFoundPage.vue'),
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
