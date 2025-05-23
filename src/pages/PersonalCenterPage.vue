<template>
  <div class="min-h-screen p-4 md:p-24">
    <div 
      class="p-4 md:p-24 transition-all duration-300"
      :class="{'blur-sm pointer-events-none': isLoading}"
    >
      <div class="max-w-4xl mx-auto">
        <!-- 用户信息卡片 - 调整为移动端布局 -->
        <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row items-center mt-16 md:mt-10">
          <NAvatar 
            :size="80" 
            :class="['md:mr-6 mb-4 md:mb-0', { 'border-blue-200': activeTab === 'profile' }]"
            :src="userData.avatar" 
            round
          />
          <div class="flex-grow w-full md:w-auto text-center md:text-left">
            <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              {{ userData.username }}
              <NTag v-if="!isCurrentUser" class="ml-2" type="info" size="small">用户主页</NTag>
            </h1>
            <p class="text-gray-600 dark:text-gray-200 mt-2 text-sm md:text-base">{{ userData.bio }}</p>
            <NSpace class="mt-4 justify-center md:justify-start" :size="[12, 0]">
              <NText depth="3" class="text-xs md:text-sm">帖子: {{ posts.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">评论: {{ comments.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">诗歌: {{ poetry.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">朗诵: {{ recitations.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">收藏: {{ favorites.length }}</NText>
            </NSpace>
          </div>
          <NButton 
            v-if="isCurrentUser"
            type="primary" 
            ghost 
            size="small"
            class="mt-4 md:mt-0"
            @click="showEditProfileModal = true"
          >
            <template #icon>
              <CreateOutline class="w-4 h-4" />
            </template>
            <span class="hidden md:inline">编辑资料</span>
            </NButton>
        </div>

        <!-- Edit Profile Modal -->
        <NModal v-model:show="showEditProfileModal" preset="card" title="编辑个人资料" class="max-w-3xl" :style="{ width: '90%' }">
          <NForm>
            <NFormItem label="个人简介">
              <NInput 
                v-model:value="editProfileForm.bio" 
                type="textarea" 
                placeholder="输入您的个人简介"
              />
            </NFormItem>
            <NFormItem label="邮箱">
              <NInput 
                v-model:value="editProfileForm.email" 
                placeholder="输入您的邮箱"
              />
            </NFormItem>
            <NFormItem label="头像">
              <NUpload 
                :show-file-list="false"
                @change="handleAvatarUpload"
              >
                <NUploadDragger>
                  <div class="flex flex-col items-center p-2">
                    <CloudUploadOutline class="text-4xl mb-2 w-5" />
                    <span class="text-sm">点击或拖拽上传头像</span>
                  </div>
                </NUploadDragger>
              </NUpload>
              <div v-if="editProfileForm.avatar && !showCropper" class="mt-2 flex justify-center">
                <NAvatar :size="80" :src="editProfileForm.avatar" />
              </div>
            </NFormItem>
            <div class="flex justify-end mt-4">
              <NButton 
                type="primary" 
                @click="handleEditProfile"
              >
                保存修改
              </NButton>
            </div>
          </NForm>
        </NModal>

        <!-- 头像裁剪弹窗 -->
        <NModal v-model:show="showCropper" preset="card" title="裁剪头像" class="max-w-3xl" :style="{ width: '90%' }">
          <div class="text-center">
            <div class="mb-4">
              <p class="text-sm text-gray-500 mb-2">请调整头像，确保最佳效果</p>
              <div class="cropper-container mx-auto" style="max-width: 400px; height: 400px;">
                <VueCropper
                  ref="cropperRef"
                  :img="cropperImg"
                  :auto-crop="true"
                  :fixed-box="true"
                  :fixed="true"
                  :auto-crop-width="300"
                  :auto-crop-height="300"
                  :center-box="true"
                  :info="true"
                  :full="true"
                  :output-type="'png'"
                />
              </div>
            </div>
            <div class="flex justify-center space-x-4">
              <NButton @click="showCropper = false">取消</NButton>
              <NButton type="primary" @click="confirmCrop">确认裁剪</NButton>
            </div>
          </div>
        </NModal>

        <!-- Tabs Navigation - 调整为移动端布局 -->
        <NTabs 
          v-model:value="activeTab" 
          type="line"
          animated 
          class="mb-4"
          :tabs-padding="10"
        >
          <NTabPane name="profile" tab="信息">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <PersonCircleOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">个人资料</span>
                </div>
              </template>
              <NGrid :cols="1" :y-gap="8" :x-gap="12" responsive="screen" :collapsed="false">
                <NGridItem>
                  <strong class="text-sm md:text-base">注册日期:</strong> <span class="text-sm md:text-base">{{ userData.registrationDate }}</span>
                </NGridItem>
                <NGridItem>
                  <strong class="text-sm md:text-base">邮箱:</strong> <span class="text-sm md:text-base">{{ userData.email }}</span>
                </NGridItem>
              </NGrid>
            </NCard>
          </NTabPane>

          <NTabPane name="posts" tab="帖子">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <EllipsisVerticalOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">帖子列表</span>
                </div>
              </template>
              <div v-if="posts.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="mb-2">
                  <NIcon size="48" class="opacity-70">
                    <EllipsisVerticalOutline />
                  </NIcon>
                </div>
                <p class="text-sm md:text-base">{{ isCurrentUser ? '你目前没有发布过帖子哦~' : '该用户目前没有发布过帖子哦~' }}</p>
              </div>
              <template v-else>
                <div v-for="post in posts" :key="post.postId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPostDetail(post.postId)">
                  <h3 class="text-lg md:text-xl font-medium">{{ post.title }}</h3>
                  <p class="text-gray-600 text-sm md:text-base line-clamp-2">{{ post.content }}</p>
                  <div class="text-right text-gray-500 text-xs md:text-sm">
                    {{ post.createdAt }}
                  </div>
                </div>
                <NPagination 
                  v-model:page="currentPage"
                  :page-size="pageSize"
                  :total="posts.length"
                  :page-slot="5"
                  size="small"
                />
              </template>
            </NCard>
          </NTabPane>

          <NTabPane name="comments" tab="评论">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <ChatboxOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">评论列表</span>
                </div>
              </template>
              <div v-if="comments.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="mb-2">
                  <NIcon size="48" class="opacity-70">
                    <ChatboxOutline />
                  </NIcon>
                </div>
                <p class="text-sm md:text-base">{{ isCurrentUser ? '你目前没有发表过评论哦~' : '该用户目前没有发表过评论哦~' }}</p>
              </div>
              <template v-else>
                <div v-for="(comment, index) in comments" :key="index" class="mb-4 pb-4 border-b">
                  <div class="flex justify-between items-center mb-2">
                    <NTag size="small" type="info">{{ comment.commentType }}</NTag>
                    <span class="text-xs text-gray-500">{{ comment.createdAt }}</span>
                  </div>
                  <div class="cursor-pointer" @click="navigateToCommentDetail(comment.objectId, comment.commentType)">
                    <p class="text-gray-700 dark:text-gray-200 text-sm md:text-base line-clamp-2">{{ comment.content }}</p>
                    <h4 class=" text-base md:text-sm font-medium text-gray-800 dark:text-gray-200 text-right">FROM——{{ comment.title }}</h4>
                  </div>
                </div>
                <NPagination 
                  v-model:page="currentPage"
                  :page-size="pageSize"
                  :total="comments.length"
                  :page-slot="5"
                  size="small"
                />
              </template>
            </NCard>
          </NTabPane>

          <NTabPane name="poetry" tab="诗歌">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <BookOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">诗歌作品</span>
                </div>
              </template>
              <div v-if="poetry.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="mb-2">
                  <NIcon size="48" class="opacity-70">
                    <BookOutline />
                  </NIcon>
                </div>
                <p class="text-sm md:text-base">{{ isCurrentUser ? '你目前没有发布过诗歌作品哦~' : '该用户目前没有发布过诗歌作品哦~' }}</p>
              </div>
              <template v-else>
                <div v-for="poem in poetry" :key="poem.poemId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPoetryDetail(poem.poemId)">
                  <h3 class="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">{{ poem.title }}</h3>
                  <pre class="whitespace-pre-wrap text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-3">{{ poem.content }}</pre>
                  <div class="text-right text-gray-500 text-xs md:text-sm">
                    {{ poem.createdAt }}
                  </div>
                </div>
                <NPagination 
                  v-model:page="currentPage"
                  :page-size="pageSize"
                  :total="poetry.length"
                  :page-slot="5"
                  size="small"
                />
              </template>
            </NCard>
          </NTabPane>

          <NTabPane name="recitations" tab="朗诵">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <VolumeHighOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">朗诵列表</span>
                </div>
              </template>
              <div v-if="recitations.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="mb-2">
                  <NIcon size="48" class="opacity-70">
                    <VolumeHighOutline />
                  </NIcon>
                </div>
                <p class="text-sm md:text-base">{{ isCurrentUser ? '你目前没有发布过朗诵作品哦~' : '该用户目前没有发布过朗诵作品哦~' }}</p>
              </div>
              <template v-else>
                <div v-for="rec in recitations" :key="rec.recitationId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToRecitationDetail(rec.recitationId)">
                  <h3 class="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">{{ rec.title }}</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-2">{{ rec.content }}</p>
                  <div class="text-right text-gray-500 dark:text-gray-400 text-xs md:text-sm">{{ rec.createdAt }}</div>
                </div>
                <NPagination v-model:page="currentPage" :page-size="pageSize" :total="recitations.length" size="small" />
              </template>
            </NCard>
          </NTabPane>

          <NTabPane name="favorites" tab="收藏">
            <NCard>
              <template #header>
                <div class="flex items-center">
                  <HeartOutline class="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span class="text-sm md:text-base">收藏列表</span>
                </div>
              </template>
              <div v-if="favorites.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                <div class="mb-2">
                  <NIcon size="48" class="opacity-70">
                    <HeartOutline />
                  </NIcon>
                </div>
                <p class="text-sm md:text-base">{{ isCurrentUser ? '你目前没有收藏任何内容哦~' : '该用户目前没有收藏任何内容哦~' }}</p>
              </div>
              <template v-else>
                <div v-for="(favorite, index) in favorites" :key="index" class="mb-4 pb-4 border-b">
                  <div class="flex justify-between items-center mb-2">
                    <NTag size="small" type="info">{{ favorite.favoriteType }}</NTag>
                    <span class="text-xs text-gray-500">{{ favorite.createdAt }}</span>
                  </div>
                  <div class="cursor-pointer" @click="navigateToFavoriteDetail(favorite)">
                    <h3 class="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200">{{ favorite.title }}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-2 text-sm md:text-base line-clamp-2">{{ favorite.content }}</p>
                    <div v-if="favorite.poemTitle" class="text-xs md:text-sm text-gray-500 mb-2">
                      <span>诗歌: {{ favorite.poemTitle }}</span>
                      <span class="ml-2">作者: {{ favorite.poemAuthor }}</span>
                    </div>
                    <div v-if="favorite.tags && favorite.tags.length > 0" class="mb-2 flex flex-wrap">
                      <NTag 
                        v-for="tag in favorite.tags" 
                        :key="tag" 
                        size="small" 
                        class="mr-1 mb-1"
                      >
                        {{ tag }}
                      </NTag>
                    </div>
                  </div>
                </div>
              </template>
            </NCard>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>

<Teleport to="body">
  <div v-show="isLoading" class="pointer-events-none">
    <PersonalCenterLoader />
  </div>
</Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { 
  NTabs, 
  NTabPane, 
  NCard, 
  NAvatar, 
  NSpace, 
  NGrid, 
  NGridItem, 
  NText, 
  NPagination, 
  NButton, 
  NModal, 
  NForm, 
  NFormItem, 
  NInput, 
  NUpload, 
  NUploadDragger, 
  NTag,
  NIcon
} from 'naive-ui'
import { 
  PersonCircleOutline, 
  BookOutline, 
  ChatboxOutline, 
  EllipsisVerticalOutline,
  CreateOutline,
  CloudUploadOutline,
  HeartOutline,
  VolumeHighOutline
} from '@vicons/ionicons5'
import { useAuthStore } from '@/store/auth';
import { getUserPosts, getUserPoems, getUserRecitations,
  getUserPoetPoemFavorites, getUserUserPoemFavorites, getUserPostFavorites, getUserReciteFavorites,
  updateUserInfo, updateUserAvatar, getUserAvatar, getUserAvatarByUsername,
  getUserPostComments, getUserPoemComments, getUserPoetComments, getUserReciteComments,
} from '@/api/personalCenter';
import type { Post } from '@/types/post';
import type { Poem } from '@/types/poem';
import type { Recitation } from '@/types/recitation';
import { useRouter, useRoute } from 'vue-router';
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';

import { showPrompt } from '@/components/functions/prompt'

// 定义props接收username参数
const props = defineProps<{
  username?: string
}>()

const route = useRoute()
const userStore = useAuthStore()
const router = useRouter()
const DEFAULT_AVATAR = '/default-avatar.png'

// 计算属性：当前正在查看的用户名
const targetUsername = computed(() => {
  return props.username || route.params.username as string || userStore.username
})

// 计算属性：是否是查看自己的资料
const isCurrentUser = computed(() => {
  return (!props.username && !route.params.username) || 
         targetUsername.value === userStore.username
})

const userData = ref({
  username: targetUsername.value || 'Unknown Author',
  avatar: DEFAULT_AVATAR,
  bio: isCurrentUser.value ? userStore.bio || '这个人很懒，什么也没留下' : '这个人很懒，什么也没留下',
  email: isCurrentUser.value ? userStore.email : '查看不了别人的邮箱哦',
  registrationDate: isCurrentUser.value ? userStore.createTime : '查看不了别人的注册时间哦',
})

// 只有是当前登录用户时才需要编辑表单
const editProfileForm = reactive({
  bio: userData.value.bio,
  email: userData.value.email,
  avatar: userData.value.avatar,
  avatarFile: null as File | null
})

const posts = ref<Post[]>([]);
const comments = ref<any[]>([]);
const poetry = ref<Poem[]>([]);
const recitations = ref<Recitation[]>([]);
const favorites = ref<any[]>([]);

const activeTab = ref('profile')
const currentPage = ref(1)
const pageSize = ref(5)

const showEditProfileModal = ref(false)

const isLoading = ref(true)
const isUpdating = ref(false)

const fetchUserAvatar = async () => {
  try {
    if (isCurrentUser.value) {
      // 获取当前登录用户头像
      const avatarUrl = await getUserAvatar(userStore.userId)
      userData.value.avatar = avatarUrl
      editProfileForm.avatar = avatarUrl
    } else {
      // 获取目标用户头像
      const avatarUrl = await getUserAvatarByUsername(targetUsername.value)
      userData.value.avatar = avatarUrl
    }
  } catch (error) {
    userData.value.avatar = DEFAULT_AVATAR
    if (isCurrentUser.value) {
      editProfileForm.avatar = DEFAULT_AVATAR
    }
  }
}

const showCropper = ref(false)
const cropperImg = ref('')
const cropperRef = ref<InstanceType<typeof VueCropper> | null>(null)

const handleAvatarUpload = (data: any) => {
  const file = data.file.file
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    showPrompt('error','请选择图片文件');
    return;
  }
  // 显示裁剪界面
  cropperImg.value = URL.createObjectURL(file)
  showCropper.value = true
  
  // 保存原始文件以备后续处理
  editProfileForm.avatarFile = file

  // 使用nextTick确保组件完全渲染后再初始化
  import('vue').then(({ nextTick }) => {
    nextTick(() => {
      if (cropperRef.value) {
        cropperRef.value.refresh();
      }
    });
  });
}

const confirmCrop = () => {
  if (!cropperRef.value) {
    showPrompt('error','裁剪组件未初始化');
    return;
  }
  
  // 获取裁剪后的图像数据
  cropperRef.value.getCropBlob((blob: Blob) => {
    // 将Blob转换为File对象
    const file = new File([blob], 'avatar.png', { type: 'image/png' })
    
    // 更新表单中的头像文件
    editProfileForm.avatarFile = file
    
    // 创建一个临时URL用于预览
    const previewUrl = URL.createObjectURL(blob)
    editProfileForm.avatar = previewUrl
    
    // 关闭裁剪界面
    showCropper.value = false
  })
}

const handleEditProfile = async () => {
  try {
    isUpdating.value = true
    // 先关闭编辑模态，避免模态遮挡加载动画
    showEditProfileModal.value = false
    const userId = String(userStore.userId)
    
    // 并行处理基本信息更新和头像更新
    await Promise.all([
      updateUserInfo(userId, editProfileForm.bio, editProfileForm.email || ''),
      editProfileForm.avatarFile ? updateAvatar(userId) : Promise.resolve()
    ])

    // 更新本地数据
    userData.value.bio = editProfileForm.bio
    userData.value.email = editProfileForm.email
    useAuthStore().setUserInfo(editProfileForm.bio, editProfileForm.email || '')
    
    showPrompt('success','个人信息更新成功')
  } catch (error: any) {
    showPrompt('error',error.message || '更新失败')
  } finally {
    isUpdating.value = false
  }
}

const updateAvatar = async (userId: string) => {
  try {
    isLoading.value = true // 全局加载状态
    
    if (!editProfileForm.avatarFile) {
      throw new Error('头像文件不存在')
    }
    
    await updateUserAvatar(
      editProfileForm.avatarFile,
      userId,
      userData.value.username,
      userData.value.email || '',
    )
    
    // 重新获取最新头像
    await fetchUserAvatar() 
    
    // 更新 auth store 中的头像，这样导航栏也会更新
    if (userData.value.avatar) {
      userStore.setUserAvatar(userData.value.avatar)
    }
  } finally {
    isLoading.value = false
  }
}

const fetchUserPosts = async () => {
  try {
    const response = await getUserPosts(targetUsername.value)
    posts.value = response.data
  } catch (error) {
    showPrompt('error', '获取帖子失败')
    posts.value = []
  }
}

const fetchUserComments = async () => {
  try {
    const [postRes, poemRes, poetRes, reciteRes] = await Promise.all([
      getUserPostComments(targetUsername.value),
      getUserPoemComments(targetUsername.value),
      getUserPoetComments(targetUsername.value),
      getUserReciteComments(targetUsername.value)
    ])
    const postComments = postRes.data.map((item: any) => ({ ...item, commentType: '帖子' }))
    const poemComments = poemRes.data.map((item: any) => ({ ...item, commentType: '用户诗歌' }))
    const poetComments = poetRes.data.map((item: any) => ({ ...item, commentType: '诗人诗歌' }))
    const reciteComments = reciteRes.data.map((item: any) => ({ ...item, commentType: '朗诵' }))
    comments.value = [...postComments, ...poemComments, ...poetComments, ...reciteComments]
  } catch (error) {
    showPrompt('error','获取评论列表失败')
    comments.value = []
  }
}

const fetchUserPoems = async () => {
  try {
    const response = await getUserPoems(targetUsername.value)
    poetry.value = response.data
  } catch (error) {
    showPrompt('error', '获取诗歌列表失败')
    poetry.value = []
  }
}

const fetchUserRecitations = async () => {
  try {
    const response = await getUserRecitations(targetUsername.value)
    recitations.value = response.data
  } catch (error) {
    showPrompt('error','获取朗诵列表失败')
    recitations.value = []
  }
}

const fetchUserFavorites = async () => {
  try {
    const [userPoemRes, postRes, reciteRes, poetPoemRes] = await Promise.all([
      getUserUserPoemFavorites(targetUsername.value),
      getUserPostFavorites(targetUsername.value),
      getUserReciteFavorites(targetUsername.value),
      getUserPoetPoemFavorites(targetUsername.value)
    ])
    const userPoemFav = userPoemRes.data.map((item: any) => ({ ...item, favoriteType: '用户诗歌' }))
    const postFav = postRes.data.map((item: any) => ({ ...item, favoriteType: '帖子' }))
    const reciteFav = reciteRes.data.map((item: any) => ({ ...item, favoriteType: '朗诵' }))
    const poetPoemFav = poetPoemRes.data.map((item: any) => ({ ...item, favoriteType: '诗人诗歌' }))
    favorites.value = [...userPoemFav, ...postFav, ...reciteFav, ...poetPoemFav]
  } catch (error) {
    showPrompt('error','获取收藏列表失败')
    favorites.value = []
  }
}

const loadInitialData = async () => {
  try {
    isLoading.value = true
    // 更新页面标题
    document.title = isCurrentUser.value ? '我的个人中心' : `${targetUsername.value}的个人主页`
    
    // 更新用户数据
    userData.value.username = targetUsername.value
    
    // 并行请求所有初始数据
    await Promise.all([
      fetchUserPosts(),
      fetchUserComments(),
      fetchUserPoems(),
      fetchUserRecitations(),
      fetchUserFavorites(),
      fetchUserAvatar()
    ])
  } catch (error) {
    showPrompt('error','数据加载失败')
  } finally {
    isLoading.value = false
  }
}

const navigateToPostDetail = (postId: number) => {
  router.push({ name: 'PoemExplanationDetail', params: { postId } })
}

const navigateToCommentDetail = (objectId: number, commentType: string) => {
  // 根据commentType进行条件导航
  if (commentType === '帖子') {
    navigateToPostDetail(objectId)
  } else if (commentType === '用户诗歌') {
    navigateToUserPoemDetail(objectId)
  } else if (commentType === '诗人诗歌') {
    navigateToPoetPoemDetail(objectId)
  } else if (commentType === '朗诵') {
    navigateToRecitationDetail(objectId)
  } else {
    // 默认跳转到通用详情或首页
    router.push({ name: 'HomePage' })
  }
}

const navigateToUserPoemDetail = (poemId: number) => {
  router.push({ name: 'UserPoemDetail', params: { poemId } })
}

const navigateToPoetPoemDetail = (poemId: number) => {
  router.push({ name: 'PoetPoemDetail', params: { poemId } })
}

const navigateToRecitationDetail = (recitationId: number) => {
  router.push({ name: 'RecitationDetail', params: { recitationId } })
}

// 根据收藏类型导航到相应详情页
const navigateToFavoriteDetail = (favorite: any) => {
  if (favorite.favoriteType === '用户诗歌') {
    navigateToUserPoemDetail(favorite.poemId)
  } else if (favorite.favoriteType === '诗人诗歌') {
    navigateToPoetPoemDetail(favorite.poemId)
  } else if (favorite.favoriteType === '帖子') {
    navigateToPostDetail(favorite.postId)
  } else if (favorite.favoriteType === '朗诵') {
    navigateToRecitationDetail(favorite.recitationId)
  } else {
    router.push({ name: 'HomePage' })
  }
}

// 点击诗歌列表跳转 （默认用户诗歌）
const navigateToPoetryDetail = (poemId: number) => {
  navigateToUserPoemDetail(poemId)
}

onMounted(() => {
  loadInitialData()
})

// 监听路由参数变化，重新加载数据
watch(
  () => route.params.username,
  (newUsername) => {
    if (newUsername !== undefined) {
      loadInitialData()
    }
  }
)

// 监听props变化
watch(
  () => props.username,
  (newUsername) => {
    if (newUsername !== undefined) {
      loadInitialData()
    }
  }
)
</script>


<style scoped>
pre {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}

.blur-sm {
  filter: blur(4px);
}

.pointer-events-none {
  pointer-events: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .min-h-screen {
    padding: 1rem;
  }
  
  .n-tabs-nav-scroll-content {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .n-tabs-tab {
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 裁剪组件样式 */
.cropper-container {
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}
</style>
