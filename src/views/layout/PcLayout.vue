<script setup>
import { CaretBottom, User, Crop, EditPen, SwitchButton } from '@element-plus/icons-vue'
import avatar from '@/assets/avatar.png'
import { useUserStore, useSbStore } from '@/stores'
import router from '@/router'
import { ref, watch } from 'vue'

const userStore = useUserStore()
const sbStore = useSbStore()

const handleCommand = async (command) => {
  if (command === 'profile') {
    router.push({ name: 'user' })
    console.log('用户点击了profile')
  } else if (command === 'avatar') {
    console.log('用户点击了avatar')
  } else if (command === 'password') {
    router.push({ name: 'user', query: { doo: 1 } })
  } else if (command === 'logout') {
    await ElMessageBox.confirm('确认退出吗?', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
      .then(() => {
        userStore.removeToken({})
        userStore.removeAuthor()
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
}

// 定义响应式变量
const hour1 = ref()
const hour2 = ref()
const minute1 = ref()
const minute2 = ref()
const totalHour = ref()
const totalMinute = ref()

// 监听输入框变化并重新计算总时间
watch([hour1, minute1, hour2, minute2], () => {
  // 解析输入的值，如果为空或者非数字则默认0，限制最大值为9999小时，59分钟
  hour1.value = Math.min(parseInt(hour1.value) || 0, 9999)
  hour2.value = Math.min(parseInt(hour2.value) || 0, 9999)
  minute1.value = Math.min(parseInt(minute1.value) || 0, 59)
  minute2.value = Math.min(parseInt(minute2.value) || 0, 59)

  // 计算总分钟数
  const totalMinutesValue = minute1.value + minute2.value
  totalHour.value = hour1.value + hour2.value + Math.floor(totalMinutesValue / 60)
  totalMinute.value = (totalMinutesValue % 60).toString().padStart(2, '0')
})

const selectText = (event) => {
  const input = event.target
  if (input.value) {
    // 如果输入框中有内容,选中所有文本
    input.select()
  }
}
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <h5>Maintenancer</h5>
        <common-menu></common-menu>
      </el-aside>
      <el-container class="main_container">
        <el-header>
          <div class="flighthour">
            <div class="time" style="margin-right: 4px">
              <span>时间1:</span>
              <input type="number" v-model="hour1" placeholder="H" @focus="selectText($event)" />
              <input type="number" v-model="minute1" placeholder="M" @focus="selectText($event)" />
            </div>
            <div class="time">
              <span>时间2:</span>
              <input type="number" v-model="hour2" placeholder="H" @focus="selectText($event)" />
              <input type="number" v-model="minute2" placeholder="M" @focus="selectText($event)" />
            </div>
            <div class="result">总时间 {{ totalHour }} : {{ totalMinute }}</div>
          </div>
          <el-dropdown placement="bottom" @command="handleCommand">
            <span class="el-dropdown__box">
              <el-avatar :src="avatar"></el-avatar>
              <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-header>
        <div class="my_box"></div>
        <el-main>
          <h2>{{ $router.currentRoute.value.meta.title }}</h2>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
.el-aside {
  width: calc(0% + 13rem);
  height: 100vh; // 添加这一行
  background-color: #fff;
  box-shadow: 0 0 0.8rem 0 rgba(0, 0, 0, 0.15);
  position: fixed; // 添加这一行
  z-index: 100;
  h5 {
    color: #5e72e4;
    font-size: 20px;
    padding: 2rem 0;
    text-align: center;
    text-shadow: 5px 5px 5px #ccc7c7;
  }
}
// 右侧
.main_container {
  margin-left: 13rem; // 添加这一行
  .el-header {
    height: 3.8rem;
    background-color: rgb(98, 113, 221);
    display: flex;
    align-items: center;
    justify-content: space-between;
    .flighthour {
      color: white;
      display: flex;
      align-items: center;
      margin-left: 20px;
      input {
        color: rgb(81, 79, 79);
        width: 75px;
        margin-right: 5px;
      }
    }
    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon {
        font-size: 1rem;
        color: white;
        margin-left: 5px;
      }
      &:active,
      &:focus {
        outline: none;
        z-index: 999;
      }
    }
  }
  .my_box {
    margin: -1px 0 0 0;
    height: 2rem;
    background-color: rgb(98, 113, 221);
  }
  .el-main {
    padding: 0 1.25rem;
    margin-top: -2rem;
    overflow: hidden; // 添加这一行
    * {
      padding: 0 1.5rem;
    }
    h2 {
      width: 100%;
      color: #32325d;
      background: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.03);
      font-size: 1.2rem;
      letter-spacing: 0.1rem;
      margin: 0 auto;
      margin-bottom: 1rem;
      padding: 0.9rem 1.5rem;
      border-radius: 0.375rem;
    }
  }
}
</style>
