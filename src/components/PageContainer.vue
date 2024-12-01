<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- 标题父传子 -->
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 添加功能具名插槽 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 内容默认插槽 -->
    <slot></slot>
  </el-card>
</template>

<style lang="less" scoped>
.page-container {
  min-height: 100vh;
  padding: 0 !important;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
