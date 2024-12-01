<script setup>
import { ref, watch, nextTick } from 'vue'
import router from '@/router'
import { useUserStore, useSbStore } from '@/stores'
import { editUserInfo } from '@/api/user'

const userStore = useUserStore()
const sbStore = useSbStore()
const inputField = ref() // 控制overlay输入框自动对焦
const show = ref(false) // dialog弹出层
const currentField = ref('') // 弹层input框内容
const currentTitle = ref('') // 弹层title
const action = ref(false) // action-sheet弹出层
const actions = ref([{ name: '退出登录', color: '#da3231' }])

// 用户信息
const userInfo = ref({
  user_name: userStore.userInfo.user_name,
  user_phone: userStore.userInfo.user_phone,
  user_tname: userStore.userInfo.user_tname,
  createTime: userStore.userInfo.user_create_time,
  currentQs: userStore.userInfo.user_current_qs
})

// 用于弹层title展示
const titles = ref({
  user_name: '用户名',
  user_phone: '手机号',
  user_tname: '真实姓名',
  createTime: '注册时间',
  currentQs: '答题进度'
})

// 修改完信息后上传时给后台判断修改什么信息
const uploadField = ref()
// 显示编辑弹出框
const showEditPopup = (field, titles) => {
  currentTitle.value = '修改' + titles
  currentField.value = userInfo.value[field]
  show.value = true

  // 通过弹层方法传field过来赋值给它，由完成button提交到后台
  uploadField.value = field
}

// 控制overlay输入框自动对焦
watch(show, (newValue) => {
  if (newValue) {
    // 当 overlay 显示时，等待下一个 DOM 更新周期然后设置焦点
    nextTick(() => {
      inputField.value.focus()
    })
  }
})

// 提交编辑
const finishEdit = async (uploadField, currentField) => {
  const res = await editUserInfo(uploadField, currentField)
  userInfo.value[uploadField] = res.data[uploadField]
  userStore.userInfo[uploadField] = res.data[uploadField]
  showNotify({ type: 'success', message: res.data.msg })
  show.value = false
}

//退出
const loginOut = async () => {
  userStore.removeToken()
  userStore.removeAuthor()
  sbStore.setSbType([])
  sbStore.setAirplaneType([])
  router.push('/login')
}
</script>

<template>
  <van-nav-bar style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white" placeholder fixed title="个人信息" />
  <body class="body">
    <van-cell class="userInfos" is-link title="头像">
      <img class="avatar" src="@/assets/avatar.png" width="60" height="60" />
    </van-cell>
    <van-cell class="userInfos" :title="titles.user_name">
      <template #value>{{ userInfo.user_name }}</template>
    </van-cell>
    <van-cell class="userInfos" is-link :title="titles.user_phone" @click="showEditPopup('user_phone', titles.user_phone)">
      <template #value>{{ userInfo.user_phone }}</template>
    </van-cell>
    <van-cell class="userInfos" is-link :title="titles.user_tname" @click="showEditPopup('user_tname', titles.user_tname)">
      <template #value>{{ userInfo.user_tname }}</template>
    </van-cell>
    <van-cell class="userInfos" title="注册时间">
      <template #value>{{ userInfo.createTime }}</template>
    </van-cell>
    <van-cell class="userInfos" title="答题进度">
      <template #value>{{ userInfo.currentQs }}</template>
    </van-cell>
    <van-button class="button" type="danger" @click="action = true">退出登录</van-button>

    <!-- overlay遮罩层 -->
    <van-overlay :show="show" @click="show = false">
      <div class="overlay" @click.stop>
        <van-nav-bar
          style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white"
          :title="currentTitle"
          placeholder
          fixed
          @click-left="show = false"
        >
          <template #left>取消</template>
          <template #right>
            <van-button @click.stop="finishEdit(uploadField, currentField)" type="success" size="small">完成</van-button>
          </template>
        </van-nav-bar>
        <van-field ref="inputField" v-model="currentField" placeholder="这里填你的新信息" />
      </div>
    </van-overlay>

    <!-- action-sheet退出 -->
    <van-action-sheet
      description="退出后不会删除任何数据，下次登录依然可以使用本账号。"
      v-model:show="action"
      :actions="actions"
      @select="loginOut"
    />
  </body>
  <footer></footer>
</template>

<style lang="less" scoped>
.body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;

  // 标题左侧文字白色
  :deep(.van-nav-bar__left) {
    color: white;
  }

  .avatar {
    border-radius: 50%;
    object-fit: cover;
  }

  .userInfos {
    min-height: 4rem;
    align-items: center;
  }

  .input {
    min-height: 5rem;
    align-items: center;
  }

  .button {
    margin-top: 5rem;
    width: 10rem;
  }
}
</style>
