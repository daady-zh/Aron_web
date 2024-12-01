<script setup>
import { userRegisterService, userLoginService, getCaptcha } from '@/api/user'
import router from '@/router'
import { useUserStore } from '@/stores/modules/user'
import { ref, watch } from 'vue'

const form = ref({
  username: '',
  password: '',
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
  await userRegisterService(form.value)
  ElMessage.success('注册成功')
  isRegister.value = true
}

// 监视切换状态
watch(isRegister, () => {
  form.value = {
    username: '',
    password: '',
    captcha: ''
  }
})

// 登陆
const userStore = useUserStore()
const handleLogin = async () => {
  const res = await userLoginService(form.value)
  userStore.setAuthor(res.data.userInfo.user_author)
  userStore.setToken(res.data.data.access_token)
  userStore.setUserInfo(res.data.userInfo)
  ElMessage.success('登陆成功')
  router.push('/home')
}
</script>

<template>
  <div>
    <div class="login" v-if="isRegister">
      <van-nav-bar style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white" placeholder fixed title="会员登录" />

      <div class="container">
        <div class="title">
          <img src="@/assets/Home_logo.png" style="height: 40px; margin-right: 10px; margin-bottom: 10px" />
          <h1>Maintenancer</h1>
          <p>开心维护，健康生活</p>
        </div>
        <van-form>
          <van-cell-group inset>
            <van-field
              autofocus
              autosize
              v-model="form.username"
              name="用户名"
              placeholder="用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              autosize
              v-model="form.password"
              type="password"
              name="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
        </van-form>
        <van-button color="#6966f4" class="login-btn" @click="handleLogin">登录</van-button>
        <van-button color="#6966f4" class="login-btn" @click="changeRegister">注册</van-button>
      </div>
      <div class="ba-footer">
        <a href="https://beian.miit.gov.cn"> 粤ICP备2024229737号-1</a>
        <a href="#">Powered by daady (G)</a>
        <a href="https://github.com/jerrykuku/luci-theme-argon">Aron @开心维护，健康生活</a>
      </div>
    </div>
    <div class="login" v-else>
      <van-nav-bar style="--van-nav-bar-background: #6966f4; --van-nav-bar-title-text-color: white" placeholder fixed title="会员注册" />
      <div class="container">
        <div class="title">
          <img src="@/assets/Home_logo.png" class="title_img" />
          <h1>Maintenancer</h1>
          <p>开心维护，健康生活</p>
        </div>
        <van-form>
          <van-cell-group inset>
            <van-field autofocus v-model="form.username" name="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
            <van-field
              autosize
              v-model="form.password"
              type="password"
              name="密码"
              placeholder="密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field autosize v-model="form.captcha" name="验证码" placeholder="验证码" :rules="[{ required: true, message: '请填写验证码' }]">
              <template #button>
                <van-image block radius="10" @click="getCaptchaCode" style="cursor: pointer" :src="captcha">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>
        <van-button color="#6966f4" class="login-btn" @click="handleRegister">注册</van-button>
        <van-button color="#6966f4" class="login-btn" @click="returnLogin">返回</van-button>
      </div>
      <div class="ba-footer">
        <a href="https://beian.miit.gov.cn"> 粤ICP备2024229737号-1</a>
        <a href="#">Powered by daady (G)</a>
        <a href="https://github.com/jerrykuku/luci-theme-argon">Aron @开心维护，健康生活</a>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.container {
  padding: 50px 40px;
  .title {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-bottom: 30px;
    .title_img {
      height: 40px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: #908e8e;
      line-height: 40px;
    }
  }
  .van-cell-group--inset {
    margin: 0;
    background-color: #f3f4f6;
  }
  .van-cell {
    padding-left: 0;
    margin: 10px 0;
    background-color: #f3f4f6;
    border-bottom: 1px solid rgb(221, 221, 221);
  }
  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    // background: linear-gradient(90deg, #ecb53c, #ff9211);
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.ba-footer {
  margin-top: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  a {
    color: gray;
  }
}
</style>
