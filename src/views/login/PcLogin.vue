<script setup>
import { userRegisterService, userLoginService, getCaptcha } from '@/api/user'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user'
import { User, Unlock, ChatLineSquare } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { onBeforeUnmount } from 'vue'

// 校验
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message: '密码必须包含至少一个小写字母和一个数字',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message: '密码必须包含至少一个小写字母和一个数字',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^[0-9a-zA-Z]{4}$/, message: '验证码为4位且只能包含数字和字母', trigger: 'blur' }
  ]
}

const form = ref({
  username: '',
  password: '',
  repassword: '',
  captcha: ''
  // telCode: ''
})

// 验证码
const captcha = ref('')
const getCaptchaCode = async () => {
  const res = await getCaptcha()
  captcha.value = res.data.data
}

// 切换注册页面
const isRegister = ref(true)
const changeRegister = () => {
  isRegister.value = false
  getCaptchaCode()
}

// 返回登录
const returnLogin = () => {
  isRegister.value = true
}

// 提交注册
const formValue = ref()
const handleRegister = async () => {
  await formValue.value.validate()
  await userRegisterService(form.value)
  ElMessage.success('注册成功')
  isRegister.value = true
}

// 监视切换状态
watch(isRegister, () => {
  form.value = {
    username: '',
    password: '',
    repassword: '',
    captcha: ''
  }
})

// 登陆
const userStore = useUserStore()
const handleLogin = async () => {
  await formValue.value.validate()
  const res = await userLoginService(form.value)
  userStore.setToken(res.data.data.access_token)
  userStore.setAuthor(res.data.userInfo.user_author)
  userStore.setUserInfo(res.data.userInfo)
  ElMessage.success('登陆成功')
  router.push('/home')
}

// 开启短信倒计时
const getCodeEvent = ref({
  totalSecond: 60, // 总秒数
  second: 60, // 倒计时的秒数
  timer: null, // 定时器id
  isDisabled: false // 倒计时禁用button
})
const res = getCodeEvent.value
// 发送短信
// const getCode = (e) => {
//   // 阻止默认传参行为
//   e.preventDefault()
//   console.log('成功发送验证码')
//   if (!res.timer && res.second === res.totalSecond) {
//     // 开启倒计时
//     res.timer = setInterval(() => {
//       res.second--
//       res.isDisabled = true
//       if (res.second < 1) {
//         clearInterval(res.timer)
//         res.timer = null
//         res.second = res.totalSecond
//         res.isDisabled = false
//       }
//     }, 1000)
//   }
// }

// 销毁器
onBeforeUnmount(() => {
  clearInterval(res.timer)
})
</script>
<template>
  <el-row class="body">
    <el-col :offset="2" :span="8">
      <div class="blur_box">
        <div class="header">
          <img src="@/assets/Home_logo.png" alt="" />
          <span><a href="#">Maintenancer</a></span>
        </div>
        <div class="form" v-if="isRegister">
          <el-form ref="formValue" style="max-width: 90%" :rules="rules" :model="form">
            <el-form-item prop="username">
              <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="form.username" v-bind:autofocus="true" @keyup.enter="handleLogin" />
            </el-form-item>
            <el-form-item prop="password" required>
              <el-input type="password" :prefix-icon="Unlock" placeholder="请输入密码" v-model="form.password" @keyup.enter="handleLogin" />
            </el-form-item>
          </el-form>
          <div class="button">
            <el-button @click="handleLogin" class="long_button" color="rgb(105,102,253)" type="primary">登 录</el-button>
            <el-button @click="changeRegister" class="long_button" color="rgb(105,102,253)" type="primary">注 册</el-button>
          </div>
        </div>
        <div class="form" v-else>
          <el-form ref="formValue" style="max-width: 90%" :rules="rules" :model="form">
            <el-form-item prop="username">
              <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="form.username" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" :prefix-icon="Unlock" placeholder="请输入密码" v-model="form.password" />
            </el-form-item>
            <el-form-item prop="repassword">
              <el-input type="password" :prefix-icon="Unlock" placeholder="请再次输入密码" v-model="form.repassword" />
            </el-form-item>
            <!-- <el-form-item class="send_code_item">
              <el-input :prefix-icon="Iphone" placeholder="请输入手机号" v-model="form.tel" style="width: 55%" />
              <div @click="getCode" class="send_code">
                <button :disabled="res.isDisabled" class="send_code_button" style="color: white">
                  {{ res.second === res.totalSecond ? '获取验证码' : res.second + '秒后重新发送' }}
                </button>
              </div>
            </el-form-item> -->
            <el-form-item prop="captcha" style="display: flex; justify-content: space-between">
              <el-input type="captcha" v-model="form.captcha" style="width: 60%" :prefix-icon="ChatLineSquare" placeholder="验证码(不区分大小写)" />
              <el-image style="cursor: pointer" :src="captcha" @click="getCaptchaCode" />
            </el-form-item>
          </el-form>
          <div class="button">
            <el-button @click="handleRegister" class="long_button" color="rgb(105,102,253)" type="primary">注 册</el-button>
            <el-button @click="returnLogin" class="long_button" color="rgb(105,102,253)" type="primary">返 回</el-button>
          </div>
        </div>
        <div class="footer">
          <span style="display: flex; align-items: center">
            <img src="../../assets/BA.png" style="width: 16px; height: 16px" />
            <a href="https://beian.miit.gov.cn"> 粤ICP备2024229737号-1</a>
          </span>
          <span><a href="#">Powered by daady (G)</a></span>
          <span>/<a href="https://github.com/jerrykuku/luci-theme-argon">Aron @开心维护，健康生活</a></span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style lang="less" scoped>
.body {
  background-image: url('@/assets/H145.JPEG');
  background-size: cover;
}
.blur_box {
  max-width: 420px;
  height: 100vh;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.6);
  .header {
    display: flex;
    align-items: center;
    margin-left: 10%;
    padding-top: 5vh;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 24px;
    color: rgb(97, 93, 93);
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    a {
      text-decoration: none;
      color: rgb(97, 93, 93);
    }
    a:hover {
      text-decoration: underline;
    }
  }
  .form {
    padding-left: 10%;
    position: relative;
    top: 14vh;
    :deep(.el-input__icon) {
      font-size: 22px;
      color: #6866ae;
    }
    .el-input--prefix {
      position: relative;
      border-bottom: 2px solid rgba(103, 115, 136, 0.4);
    }
    .el-input--prefix::before {
      content: '';
      position: absolute;
      bottom: -2px; /* Set this to the negative of your border thickness */
      left: 50%;
      width: 0;
      height: 2px;
      background-color: rgba(78, 74, 192, 0.5);
      transition: all 0.3s;
      transform: translateX(-50%);
      visibility: hidden;
    }
    .el-input--prefix:focus-within::before {
      width: 100%;
      visibility: visible;
    }
    :deep(.el-input__wrapper) {
      box-shadow: none;
      background-color: transparent !important;
    }
    :deep(.el-input__inner::placeholder) {
      color: #6866ae;
    }
    .button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: left;
      height: 100%;
      margin-top: 8vh;
    }
    .long_button {
      margin: 10px 0;
      width: 90%;
    }
    :deep(.el-form-item__content) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .send_code_button {
      width: 100px;
      height: 30px;
      line-height: 30px;
      background-color: #9a9393;
      border: none;
      cursor: pointer;
      border-radius: 6px;
    }
    .send_code_button:hover {
      background-color: rgba(105, 102, 253, 0.8);
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 2vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 14px;
    a {
      color: #6866ae;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  }
}
</style>
