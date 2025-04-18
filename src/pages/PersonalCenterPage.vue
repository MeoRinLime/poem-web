
<template>
  <div class="min-h-screen p-4 md:p-24">
    <PersonalCenterLoader v-show="isLoading" />
    <div 
      class="p-4 md:p-24 transition-all duration-300"
      :class="{'blur-sm pointer-events-none': isLoading}"
    >
      <div class="max-w-4xl mx-auto">
        <!-- 用户信息卡片 - 调整为移动端布局 -->
        <div class="bg-white shadow-lg rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row items-center mt-16 md:mt-10">
          <NAvatar 
            :size="80" 
            :class="['md:mr-6 mb-4 md:mb-0', { 'border-blue-200': activeTab === 'profile' }]"
            :src="userData.avatar" 
          />
          <div class="flex-grow w-full md:w-auto text-center md:text-left">
            <h1 class="text-2xl md:text-3xl font-semibold text-gray-800">
              {{ userData.username }}
            </h1>
            <p class="text-gray-600 mt-2 text-sm md:text-base">{{ userData.bio }}</p>
            <NSpace class="mt-4 justify-center md:justify-start" :size="[12, 0]">
              <NText depth="3" class="text-xs md:text-sm">帖子: {{ posts.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">评论: {{ comments.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">诗歌: {{ poetry.length }}</NText>
              <NText depth="3" class="text-xs md:text-sm">收藏: {{ favorites.length }}</NText>
            </NSpace>
          </div>
          <NButton 
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
              <div v-if="editProfileForm.avatar" class="mt-2 flex justify-center">
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
              <div v-for="comment in comments" :key="comment.objectId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToCommentDetail(comment.objectId)">
                <p class="text-gray-700 text-sm md:text-base line-clamp-2">{{ comment.content }}</p>
                <h3 class="text-lg md:text-xl font-medium text-gray-800 text-right">FROM——{{ comment.title }}</h3>
                <div class="text-right text-gray-500 text-xs md:text-sm">
                  {{ comment.createdAt }}
                </div>
              </div>
              <NPagination 
                v-model:page="currentPage"
                :page-size="pageSize"
                :total="comments.length"
                :page-slot="5"
                size="small"
              />
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
              <div v-for="poem in poetry" :key="poem.poemId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPoetryDetail(poem.poemId)">
                <h3 class="text-lg md:text-xl font-medium text-gray-800">{{ poem.title }}</h3>
                <pre class="whitespace-pre-wrap text-gray-600 text-sm md:text-base line-clamp-3">{{ poem.content }}</pre>
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
              <div v-for="favorite in favorites" :key="favorite.postId" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPostDetail(favorite.postId)">
                <h3 class="text-lg md:text-xl font-medium text-gray-800">{{ favorite.title }}</h3>
                <p class="text-gray-600 mb-2 text-sm md:text-base line-clamp-2">{{ favorite.content }}</p>
                <div v-if="favorite.poemTitle" class="text-xs md:text-sm text-gray-500 mb-2">
                  <span>诗歌: {{ favorite.poemTitle }}</span>
                  <span class="ml-2">作者: {{ favorite.poemAuthor }}</span>
                </div>
                <div v-if="favorite.tag && favorite.tag.length > 0" class="mb-2 flex flex-wrap">
                  <NTag 
                    v-for="tag in favorite.tag" 
                    :key="tag" 
                    size="small" 
                    class="mr-1 mb-1"
                  >
                    {{ tag }}
                  </NTag>
                </div>
                <div class="text-right text-gray-500 text-xs md:text-sm">
                  {{ favorite.createdAt }}
                </div>
              </div>
              <NPagination 
                v-model:page="currentPage"
                :page-size="pageSize"
                :total="favorites.length"
                :page-slot="5"
                size="small"
              />
            </NCard>
          </NTabPane>
        </NTabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
  useMessage,
  NTag
} from 'naive-ui'
import { 
  PersonCircleOutline, 
  BookOutline, 
  ChatboxOutline, 
  EllipsisVerticalOutline,
  CreateOutline,
  CloudUploadOutline,
  HeartOutline
} from '@vicons/ionicons5'
import { useAuthStore } from '@/store/auth';
import {getUserPosts, getUserPoems, getUserComments, getUserFavorites, updateUserInfo, updateUserAvatar, getUserAvatar } from '@/api/personalCenter';
import { useRouter } from 'vue-router';

interface Post {
  postId: number
  title: string
  content: string
  createdAt: string
  likeCount: number
  commentCount: number
  poemTitle?: string
  poemAuthor?: string
  tag?: string[]
}

interface Comment {
  commentId: number
  objectId: number
  content: string
  createdAt: string
  title: string
}

interface Poetry {
  poemId: number
  title: string
  content: string
  createdAt: string
  likeCount: number
  commentCount: number
}

const userStore = useAuthStore()
const router = useRouter()
const DEFAULT_AVATAR = '/default-avatar.png'

const userData = ref({
  username: userStore.username || 'Unknown Author',
  avatar: DEFAULT_AVATAR,
  bio: userStore.bio || '这个人很懒，什么也没留下',
  email: userStore.email,
  registrationDate: userStore.createTime,
})

const editProfileForm = reactive({
  bio: userData.value.bio,
  email: userData.value.email,
  avatar: userData.value.avatar,
  avatarFile: null as File | null
})

const posts = ref<Post[]>([]);
const comments = ref<Comment[]>([]);
const poetry = ref<Poetry[]>([]);
const favorites = ref<Post[]>([]);

const activeTab = ref('profile')
const currentPage = ref(1)
const pageSize = ref(5)

const showEditProfileModal = ref(false)

const message = useMessage()

// 加载状态控制
const isLoading = ref(true)
const isUpdating = ref(false)

const fetchUserAvatar = async () => {
  try {
    const avatarUrl = await getUserAvatar(userStore.userId)
    userData.value.avatar = avatarUrl
    editProfileForm.avatar = avatarUrl
  } catch (error) {
    userData.value.avatar = DEFAULT_AVATAR
    editProfileForm.avatar = DEFAULT_AVATAR
  }
}

const handleAvatarUpload = (data: { file: { file: File } }) => {
  const file = data.file.file
  editProfileForm.avatar = URL.createObjectURL(file)
  editProfileForm.avatarFile = file
}

const handleEditProfile = async () => {
  try {
    isUpdating.value = true
    const userId = String(userStore.userId)
    
    // 并行处理基本信息更新和头像更新
    await Promise.all([
      updateUserInfo(userId, editProfileForm.bio, editProfileForm.email),
      editProfileForm.avatarFile ? updateAvatar(userId) : Promise.resolve()
    ])

    // 更新本地数据
    userData.value.bio = editProfileForm.bio
    userData.value.email = editProfileForm.email
    useAuthStore().setUserInfo(editProfileForm.bio, editProfileForm.email)
    
    message.success('个人信息更新成功')
    showEditProfileModal.value = false
  } catch (error) {
    message.error(error.message || '更新失败')
  } finally {
    isUpdating.value = false
  }
}

const updateAvatar = async (userId: string) => {
  try {
    isLoading.value = true // 全局加载状态
    await updateUserAvatar(
      editProfileForm.avatarFile!,
      userId,
      userData.value.username,
      userData.value.email,
    )
    await fetchUserAvatar() // 重新获取最新头像
  } finally {
    isLoading.value = false
  }
}

const fetchUserPosts = async () => {
  const response = await getUserPosts(userStore.username || '')
  posts.value = response.data
}

const fetchUserComments = async () => {
  const response = await getUserComments(userStore.username || '')
  comments.value = response.data
}

const fetchUserPoems = async () => {
  const response = await getUserPoems(userStore.username || '')
  poetry.value = response.data
}

const fetchUserFavorites = async () => {
  const response = await getUserFavorites(userStore.username || '')
  favorites.value = response.data
}

const loadInitialData = async () => {
  try {
    isLoading.value = true
    
    // 并行请求所有初始数据
    await Promise.all([
      fetchUserPosts(),
      fetchUserComments(),
      fetchUserPoems(),
      fetchUserFavorites(),
      fetchUserAvatar()
    ])
  } catch (error) {
    message.error('数据加载失败')
  } finally {
    isLoading.value = false
  }
}

const navigateToPostDetail = (postId: number) => {
  router.push({ name: 'PoemExplanationDetail', params: { postId } })
}

const navigateToCommentDetail = (objectId: number) => {
  router.push({ name: 'PoemExplanationDetail', params: { postId: objectId } })
}

const navigateToPoetryDetail = (poetryId: number) => {
  router.push({ name: 'UserPoemDetail', params: { poemId: poetryId } })
}


onMounted(() => {
  loadInitialData()
})

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
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
