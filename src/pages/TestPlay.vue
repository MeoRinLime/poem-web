<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Vue Cropper 演示</h1>
    
    <div class="mb-4">
      <input type="file" accept="image/*" @change="uploadImage" />
    </div>
    
    <div v-if="imgSrc" class="flex flex-col lg:flex-row gap-4">
      <div class="w-full lg:w-2/3 border p-2">
        <h2 class="text-lg font-semibold mb-2">裁剪区域</h2>
        <VueCropper
          ref="cropperRef"
          :img="imgSrc"
          :outputSize="1"
          :outputType="outputType"
          :info="true"
          :full="true"
          :canMove="true"
          :canMoveBox="true"
          :original="true"
          :autoCrop="true"
          :autoCropWidth="300"
          :autoCropHeight="300"
          :fixedBox="fixedBox"
          :fixedNumber="fixedNumber"
          @realTime="realTimeData"
        />
      </div>
      
      <div class="w-full lg:w-1/3">
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">预览</h2>
          <div class="preview-box bg-gray-100 overflow-hidden" :style="{ width: '300px', height: '300px' }">
            <div class="img-preview" :style="previewStyle"></div>
          </div>
        </div>
        
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">选项</h2>
          <div class="mb-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="fixedBox" class="mr-2" />
              固定裁剪框
            </label>
          </div>
          <div class="mb-2">
            <label class="mr-2">裁剪比例：</label>
            <select v-model="aspectRatio" @change="changeAspectRatio" class="border p-1">
              <option value="1:1">1:1</option>
              <option value="4:3">4:3</option>
              <option value="16:9">16:9</option>
              <option value="free">自由比例</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="mr-2">输出格式：</label>
            <select v-model="outputType" class="border p-1">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>
        </div>
        
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">操作</h2>
          <div class="flex flex-wrap gap-2">
            <button @click="cropImage" class="bg-blue-500 text-white px-4 py-2 rounded">裁剪</button>
            <button @click="rotateLeft" class="bg-gray-500 text-white px-4 py-2 rounded">向左旋转</button>
            <button @click="rotateRight" class="bg-gray-500 text-white px-4 py-2 rounded">向右旋转</button>
            <button @click="resetCropper" class="bg-red-500 text-white px-4 py-2 rounded">重置</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="cropImg" class="mt-4">
      <h2 class="text-lg font-semibold mb-2">裁剪结果</h2>
      <img :src="cropImg" alt="裁剪结果" class="max-w-full border" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
// 修正导入方式
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

// 裁剪相关的参数
const cropperRef = ref<any>(null)
const imgSrc = ref<string>('')
const cropImg = ref<string>('')
const fixedBox = ref<boolean>(false)
const fixedNumber = ref<[number, number]>([1, 1])
const aspectRatio = ref<string>('1:1')
const outputType = ref<string>('jpeg')
const previewStyle = reactive({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  margin: '0 auto'
})

// 预览数据
const realTimeData = (data: any) => {
  const { w, h, url } = data
  if (w && h) {
    previewStyle.width = w + 'px'
    previewStyle.height = h + 'px'
    previewStyle.backgroundImage = 'url(' + url + ')'
    previewStyle.backgroundPosition = data.x + 'px ' + data.y + 'px'
    previewStyle.backgroundSize = (data.w / data.sw) * 100 + '% ' + (data.h / data.sh) * 100 + '%'
  }
}

// 上传图片
const uploadImage = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imgSrc.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 裁剪图片
const cropImage = () => {
  if (cropperRef.value) {
    cropperRef.value.getCropData((data: string) => {
      cropImg.value = data
    })
  }
}

// 修改裁剪比例
const changeAspectRatio = () => {
  if (aspectRatio.value === 'free') {
    fixedNumber.value = [0, 0]
  } else {
    const [width, height] = aspectRatio.value.split(':').map(Number)
    fixedNumber.value = [width, height]
  }
}

// 向左旋转
const rotateLeft = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateLeft()
  }
}

// 向右旋转
const rotateRight = () => {
  if (cropperRef.value) {
    cropperRef.value.rotateRight()
  }
}

// 重置裁剪器
const resetCropper = () => {
  if (cropperRef.value) {
    cropperRef.value.refresh()
  }
}

// 组件挂载后初始化
onMounted(() => {
  // 初始化设置
  changeAspectRatio()
})
</script>

<style scoped>
.img-preview {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  height: 100%;
}

.vue-cropper {
  height: 500px;
  width: 100%;
}
</style>