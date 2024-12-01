<script setup>
import { ref } from 'vue'

const aa = ref([])
aa.value = localStorage.getItem('user')
</script>

<template>
  <page-container title="首页开发中">
    <template #extra>
      <el-button type="primary">按钮</el-button>
    </template>
    {{ aa }}
  </page-container>
</template>
