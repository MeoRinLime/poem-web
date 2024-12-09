<script setup lang="ts">
import { ref, reactive } from 'vue'
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
  useMessage
} from 'naive-ui'
import { 
  PersonCircleOutline, 
  BookOutline, 
  ChatboxOutline, 
  EllipsisVerticalOutline,
  CreateOutline,
  CloudUploadOutline
} from '@vicons/ionicons5'
import { useAuthStore } from '@/store/auth';

interface Post {
  id: number
  title: string
  content: string
  createdAt: string
}

interface Comment {
  id: number
  postId: number
  content: string
  createdAt: string
}

interface Poetry {
  id: number
  title: string
  content: string
  createdAt: string
}

const userStore = useAuthStore()
const DEFAULT_AVATAR = '/default-avatar.png'

// Simulated user data and content
const userData = ref({
  username: userStore.username || 'Unknown Author',
  avatar: DEFAULT_AVATAR, // 头像功能暂时不做
  bio: userStore.bio || '这个人很懒，什么也没留下',
  email: 'poet@example.com',
  registrationDate: '2023-01-15'
})

const posts = ref<Post[]>([
  { 
    id: 1, 
    title: '关于生活的随笔', 
    content: '生活就像一首诗，需要细细品味...', 
    createdAt: '2024-03-15' 
  }
])

const comments = ref<Comment[]>([
  { 
    id: 1, 
    postId: 1, 
    content: '这篇文章很有感触', 
    createdAt: '2024-03-16' 
  }
])

const poetry = ref<Poetry[]>([
  { 
    id: 1, 
    title: '夏日微风', 
    content: '轻轻吹过 / 带走一丝炎热 / 留下温柔', 
    createdAt: '2024-02-20' 
  }
])

const activeTab = ref('profile')
const currentPage = ref(1)
const pageSize = ref(5)

// Edit profile modal state
const showEditProfileModal = ref(false)
const editProfileForm = reactive({
  bio: userData.value.bio,
  email: userData.value.email,
  avatar: userData.value.avatar
})

const message = useMessage()

// Handle profile edit
const handleEditProfile = () => {
  // Update user data
  userData.value.bio = editProfileForm.bio
  userData.value.email = editProfileForm.email
  
  // If avatar is changed, update it (in real app, would involve file upload)
  if (editProfileForm.avatar !== userData.value.avatar) {
    userData.value.avatar = editProfileForm.avatar
  }

  // Close modal and show success message
  showEditProfileModal.value = false
  message.success('个人信息更新成功')
}

// Navigation functions for detailed views
const navigateToPostDetail = (postId: number) => {
  // Implement navigation to post detail page
  console.log(`Navigating to post ${postId}`)
  // Use Vue Router or your navigation method
}

const navigateToCommentDetail = (commentId: number) => {
  // Implement navigation to comment detail page
  console.log(`Navigating to comment ${commentId}`)
  // Use Vue Router or your navigation method
}

const navigateToPoetryDetail = (poetryId: number) => {
  // Implement navigation to poetry detail page
  console.log(`Navigating to poetry ${poetryId}`)
  // Use Vue Router or your navigation method
}
</script>

<template>
  <div class="min-h-screen p-24">
    <div class="max-w-4xl mx-auto">
      <!-- User Profile Header with Edit Button -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-6 flex items-center">
        <NAvatar 
          :size="120" 
          :src="userData.avatar" 
          :class="['mr-6', { 'border-blue-200': activeTab === 'profile' }]"
        />
        <div class="flex-grow">
          <h1 class="text-3xl font-semibold text-gray-800">
            {{ userData.username }}
          </h1>
          <p class="text-gray-600 mt-2">{{ userData.bio }}</p>
          <NSpace class="mt-4" justify="start">
            <NText depth="3">帖子: {{ posts.length }}</NText>
            <NText depth="3">评论: {{ comments.length }}</NText>
            <NText depth="3">诗歌: {{ poetry.length }}</NText>
          </NSpace>
        </div>
        <NButton 
          type="primary" 
          ghost 
          @click="showEditProfileModal = true"
        >
          <template #icon>
            <CreateOutline />
          </template>
          编辑资料
        </NButton>
      </div>

      <!-- Edit Profile Modal -->
      <NModal v-model:show="showEditProfileModal" preset="card" title="编辑个人资料" class="max-w-3xl">
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
              @change="(data) => {
                // Handle avatar upload 
                editProfileForm.avatar = URL.createObjectURL(data.file.file)
              }"
            >
              <NUploadDragger>
                <div class="flex flex-col items-center">
                  <CloudUploadOutline class="text-4xl mb-2 w-5" />
                  <span>点击或拖拽上传头像</span>
                </div>
              </NUploadDragger>
            </NUpload>
            <div v-if="editProfileForm.avatar" class="mt-2">
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

      <!-- Tabs Navigation -->
      <NTabs 
        v-model:value="activeTab" 
        type="card" 
        animated 
        class="mb-4"
      >
        <NTabPane name="profile" tab="个人信息">
          <NCard>
            <template #header>
              <div class="flex items-center">
                <PersonCircleOutline class="mr-2 w-5 h-5" />
                <span>个人资料</span>
              </div>
            </template>
            <NGrid :cols="2" :x-gap="12">
              <NGridItem>
                <strong>注册日期:</strong> {{ userData.registrationDate }}
              </NGridItem>
              <NGridItem>
                <strong>邮箱:</strong> {{ userData.email }}
              </NGridItem>
            </NGrid>
          </NCard>
        </NTabPane>

        <NTabPane name="posts" tab="我的帖子">
          <NCard>
            <template #header>
              <div class="flex items-center">
                <EllipsisVerticalOutline class="mr-2 w-5 h-5" />
                <span>帖子列表</span>
              </div>
            </template>
            <div v-for="post in posts" :key="post.id" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPostDetail(post.id)">
              <h3 class="text-xl font-medium">{{ post.title }}</h3>
              <p class="text-gray-600">{{ post.content }}</p>
              <div class="text-right text-gray-500 text-sm">
                {{ post.createdAt }}
              </div>
            </div>
            <NPagination 
              v-model:page="currentPage"
              :page-size="pageSize"
              :total="posts.length"
            />
          </NCard>
        </NTabPane>

        <NTabPane name="comments" tab="我的评论">
          <NCard>
            <template #header>
              <div class="flex items-center">
                <ChatboxOutline class="mr-2 w-5 h-5" />
                <span>评论列表</span>
              </div>
            </template>
            <div v-for="comment in comments" :key="comment.id" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToCommentDetail(comment.id)">
              <p class="text-gray-700">{{ comment.content }}</p>
              <div class="text-right text-gray-500 text-sm">
                {{ comment.createdAt }}
              </div>
            </div>
            <NPagination 
              v-model:page="currentPage"
              :page-size="pageSize"
              :total="comments.length"
            />
          </NCard>
        </NTabPane>

        <NTabPane name="poetry" tab="我的诗歌">
          <NCard>
            <template #header>
              <div class="flex items-center">
                <BookOutline class="mr-2 w-5 h-5" />
                <span>诗歌作品</span>
              </div>
            </template>
            <div v-for="poem in poetry" :key="poem.id" class="mb-4 pb-4 border-b cursor-pointer" @click="navigateToPoetryDetail(poem.id)">
              <h3 class="text-xl font-medium text-gray-800">{{ poem.title }}</h3>
              <pre class="whitespace-pre-wrap text-gray-600">{{ poem.content }}</pre>
              <div class="text-right text-gray-500 text-sm">
                {{ poem.createdAt }}
              </div>
            </div>
            <NPagination 
              v-model:page="currentPage"
              :page-size="pageSize"
              :total="poetry.length"
            />
          </NCard>
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>

<style scoped>
pre {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}
</style>