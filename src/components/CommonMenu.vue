<script setup>
import router from '@/router'
import { useUserStore, useSbStore } from '@/stores/index.js'

// 退出
const userStore = useUserStore()
const sbStore = useSbStore()

const logout = async () => {
  await ElMessageBox.confirm('确认退出吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      userStore.removeToken('')
      userStore.removeAuthor('')
      sbStore.setSbType([])
      sbStore.setAirplaneType([])
      // userStore.setUser({})
      router.push('/login')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Canceled'
      })
    })
}
</script>
<template>
  <el-menu class="menu" active-text-color="rgba(98, 113, 221)" :default-active="$route.path" :unique-opened="true" router>
    <el-menu-item index="/home">
      <img style="height: 20px; width: 20px" src="@/assets/Home.png" alt="HomeIcon" />
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu index="/modules">
      <template #title>
        <img style="height: 20px; width: 20px" src="@/assets/category.png" alt="CategoryIcon" />
        <span>插件分类</span>
      </template>
      <el-menu-item index="/modules/vibration">调振动工具</el-menu-item>
      <el-menu-item index="/modules/standard">标准速查</el-menu-item>
      <el-menu-item index="/modules/question">执照英语</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/department">
      <template #title>
        <img style="height: 20px; width: 20px" src="@/assets/proceduer.png" alt="" />
        <span>部门模块</span>
      </template>
      <el-menu-item index="/department/tech">技术室</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="" @click="logout">
      <img style="height: 20px; width: 20px" src="@/assets/exit.png" alt="HomeIcon" />
      <span>退出</span>
    </el-menu-item>
  </el-menu>
</template>

<style lang="less" scoped>
.el-menu {
  border: 0;
  margin: 0.1rem 0.5rem 0.1rem 0.5rem;
  span {
    font-weight: bold;
  }
  img {
    margin-right: 8px;
  }
}
.el-menu-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  width: 0;
  height: 1px;
  background-color: rgba(98, 113, 221);
  transition: width 0.4s ease;
}
.el-menu-item:hover {
  background-color: transparent !important;
}
.el-menu-item:hover::after {
  width: calc(100% - 20px); /* 这里假设你希望在悬停时边框宽度为元素宽度减去40px */
}
/* 当子菜单项处于激活状态时，将宽度设置为与文本宽度相匹配 */
.el-menu-item.is-active::after {
  width: calc(100% - 20px); /* 根据实际情况调整 */
}
:deep(.el-sub-menu.is-opened .el-sub-menu__title) {
  background-color: rgba(98, 113, 221, 0.2);
  border-radius: 10px;
}
/*菜单展开箭头样式*/
.el-sub-menu :deep(.el-sub-menu__icon-arrow) {
  transform: rotate(-90deg) !important;
  font-size: large;
}
.el-sub-menu.is-opened > :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  transform: rotate(0deg) !important;
}
</style>
