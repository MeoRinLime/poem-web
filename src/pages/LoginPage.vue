<template>
  <div class="flex items-center justify-center min-h-screen p-4">
    <div class="bg-white shadow-lg rounded-lg w-full max-w-md md:max-w-4xl md:h-auto md:flex overflow-hidden">
      <!-- 左侧欢迎区域 - 移动端隐藏，平板及以上显示 -->
      <div class="hidden md:block md:w-1/2 bg-gradient-to-r from-amber-500 to-amber-500 rounded-l-lg flex items-center justify-center"> 
        <div class="text-white space-y-6 p-10 font-serif">
          <h1 class="text-4xl font-bold" style="font-family: Georgia, serif">欢迎来到诗韵！</h1>
          <p class="text-lg" style="font-family: Georgia, serif">
            {{ isLoginForm ? '马上登录开始探索美妙的诗词世界' : '注册一个新账号，开启诗词之旅' }}
          </p>
        </div>
      </div>
      
      <!-- 右侧表单区域 -->
      <div class="w-full md:w-1/2 p-6 md:p-10 relative">
        <!-- 移动端标题 -->
        <div class="md:hidden mb-6 text-center">
          <h1 class="text-3xl font-bold text-amber-600 mb-2">诗韵</h1>
          <p class="text-gray-600">
            {{ isLoginForm ? '登录开始探索诗词世界' : '注册开启诗词之旅' }}
          </p>
        </div>
        
        <Transition 
          mode="out-in" 
          enter-from-class="opacity-0 translate-x-full" 
          enter-active-class="transition duration-300 ease-out" 
          enter-to-class="opacity-100 translate-x-0"
          leave-from-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-300 ease-in"
          leave-to-class="opacity-0 -translate-x-full"
        >
          <div v-if="isLoginForm" key="login" class="w-full" style="font-family: Courier New, Courier, monospace">
            <h2 class="text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-center">登录</h2>
            <form @submit.prevent="handleLogin" class="space-y-4 w-full md:w-4/5 mx-auto">
              <div>
                <input 
                  id="username" 
                  v-model="loginForm.username"
                  name="username" 
                  type="text" 
                  placeholder="用户名或邮箱" 
                  autocomplete="username" 
                  required
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div>
                <input 
                  id="password" 
                  v-model="loginForm.password"
                  name="password" 
                  type="password" 
                  placeholder="密码" 
                  autocomplete="current-password" 
                  required 
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    class="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" 
                  />
                  <label for="remember-me" class="ml-2 block text-sm text-gray-900">记住我</label>
                </div>
                <div class="text-sm">
                  <a href="#" class="font-medium text-amber-600 hover:text-amber-500">忘记密码？</a>
                </div>
              </div>
              <div class="w-full md:w-2/3 mx-auto pt-6">
                <button 
                  type="submit" 
                  class="flex w-full justify-center rounded-full border border-transparent bg-amber-600 py-3 px-4 text-m font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  登录 >
                </button>
              </div>
            </form>
            <p class="text-center text-sm text-gray-600 mt-6">
              没有账号？
              <button 
                @click="switchToRegister" 
                class="font-medium text-amber-600 hover:text-amber-500"
              >
                马上注册
              </button>
            </p>
          </div>

          <div v-else key="register" class="w-full" style="font-family: Courier New, Courier, monospace">
            <h2 class="text-3xl font-bold mb-4 text-center">注册</h2>
            <h4 class="mb-6 text-center opacity-50">让我们的旅途从这里开始吧</h4>
            <form @submit.prevent="handleRegister" class="space-y-4 w-full md:w-4/5 mx-auto">
              <div>
                <input 
                  id="new-username" 
                  v-model="registerForm.username"
                  name="username" 
                  type="text" 
                  placeholder="用户名" 
                  required
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div>
                <input 
                  id="new-email" 
                  v-model="registerForm.email"
                  name="email" 
                  type="email" 
                  placeholder="邮箱" 
                  required
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div>
                <input 
                  id="new-password" 
                  v-model="registerForm.password"
                  name="password" 
                  type="password" 
                  placeholder="密码" 
                  required 
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div>
                <input 
                  id="confirm-password" 
                  v-model="registerForm.confirmPassword"
                  name="confirm-password" 
                  type="password" 
                  placeholder="确认密码" 
                  required 
                  class="appearance-none rounded-2xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm w-full" 
                />
              </div>
              <div class="w-full md:w-2/3 mx-auto pt-6">
                <div v-if="registerError" class="text-red-500 text-sm mb-4 text-center">
                  {{ registerError }}
                </div>
                <button 
                  type="submit" 
                  :disabled="isLoading"
                  class="flex w-full justify-center rounded-full border border-transparent bg-amber-600 py-3 px-4 text-m font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {{ isLoading ? '注册中...' : '注册 >' }}
                </button>
              </div>
            </form>
            <p class="text-center text-sm text-gray-600 mt-6">
              已有账号？
              <button 
                @click="switchToLogin" 
                class="font-medium text-amber-600 hover:text-amber-500"
              >
                马上登录
              </button>
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { login, register } from '@/api/auth'
import router from '@/router';
import { useAuthStore } from '@/store/auth';
import { useMessage } from 'naive-ui'
import { getUserAvatar } from '@/api/personalCenter'

const message = useMessage()
const isLoginForm = ref(true)
const registerError = ref('')
const isLoading = ref(false)
let avatarUrl = ref('');
const loginForm = reactive({
  username: '', // 用户名或邮箱
  password: '',
});

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const switchToRegister = () => {
  isLoginForm.value = false
}

const switchToLogin = () => {
  isLoginForm.value = true
}

const handleLogin = async () => {
  try {
    const data = await login(loginForm.username, loginForm.password);
    router.push('/');
    const token = data.token;
    const username = data.user.username;
    const bio = data.user.bio;
    const createTime = data.user.createTime;
    const email = data.user.email;
    const userId = data.user.id;
    const rememberMe = document.getElementById('remember-me') as HTMLInputElement;
    useAuthStore().login(token, username, bio, createTime, email,rememberMe.checked, userId);
    avatarUrl.value = await getUserAvatar(userId);
    useAuthStore().setUserAvatar(avatarUrl.value);
    message.success(
          '登录成功！欢迎回到诗词的世界！'
        );
    //console.log('登录成功', data);
  } catch (error: any) {
    message.error(
          '登录失败，请检查用户名和密码是否正确！'
        );
    console.error('登录失败:', error.message);
  }
};

const handleRegister = async () => {
  registerError.value = ''
  isLoading.value = true
  try {
    const data = await register(
      registerForm.username,
      registerForm.email,
      registerForm.password,
      registerForm.confirmPassword,
    );
    message.success('注册成功，请登录');
    switchToLogin();
  } catch (error: any) {
    message.error(error.message + ' · 名称或邮箱已被占用');
  } finally {
    isLoading.value = false
  }
};
</script>

<style scoped>
/* 确保移动端输入框字体大小合适 */
input {
  font-size: 16px; /* 防止iOS设备缩放 */
}

/* 调整移动端按钮大小 */
button {
  min-height: 44px; /* 提高触摸友好性 */
}

/* 过渡动画优化 */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>