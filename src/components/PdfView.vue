<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: {
    type: String, //pdf文件地址
    required: true
  },
  sb_number: {
    type: String,
    required: true
  },
  sb_airplane: {
    type: String,
    required: true
  },
  sb_type: {
    type: String,
    required: true
  }
})

const pdfUrl = ref('') // pdf文件地址
const fileUrl = '/pdf/web/viewer.html?file=' // pdfjs文件地址

onMounted(() => {
  //文件名
  const pdfFileName = `${props.sb_type} ${props.sb_number}.pdf`
  // 文件真实路径
  // 基地址/H135/文件名
  const pdfFileUrl = `${props.url}/${props.sb_airplane}/${pdfFileName}`
  pdfUrl.value = fileUrl + encodeURIComponent(pdfFileUrl)
  // encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
  // 核心就是将 iframe 的 src 属性设置为 pdfjs 的地址，然后将 pdf 文件的地址作为参数传递给 pdfjs
  pdfUrl.value = fileUrl + encodeURIComponent(props.url)
})
</script>

<template>
  <div class="container">
    <!-- <iframe :src="pdfUrl" width="100%" height="100%"></iframe> -->
    <a :href="pdfUrl" target="_blank" @click.stop>{{ sb_number }}</a>
  </div>
</template>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
}
</style>
