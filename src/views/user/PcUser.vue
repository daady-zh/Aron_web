<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { editPwd } from '@/api/user'
import { useUserStore } from '@/stores'

const route = useRoute() // 路由实例
const userStore = useUserStore()
const isPwd = ref(false) // 是否修改密码页面

// 校验
const rules = {
  // 修改密码模块
  oldPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message: '密码必须包含至少一个小写字母和一个数字',
      trigger: 'blur'
    }
  ],
  newPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message: '密码必须包含至少一个小写字母和一个数字',
      trigger: 'blur'
    }
  ],
  rePwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为 6 个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      message: '密码必须包含至少一个小写字母和一个数字',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== params.value.newPwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  // 个人信息模块
  phone: [],
  tname: []
}

// 用户信息参数
const params = ref({
  id: '', //id
  username: '', // 用户名
  oldPwd: '', //旧密码
  newPwd: '', //新密码
  rePwd: '', //新密码
  phone: '', //手机号
  tname: '', //真实姓名
  createTime: '', //注册时间
  currentQs: '' //当前答题进度
})

params.value.username = userStore.userInfo.user_name
params.value.id = userStore.userInfo.id
params.value.phone = userStore.userInfo.user_phone
params.value.tname = userStore.userInfo.user_tname
params.value.createTime = userStore.userInfo.user_create_time
params.value.currentQs = userStore.userInfo.user_current_qs
watch(
  () => route.query.doo,
  async (newValue) => {
    isPwd.value = newValue
  },
  { immediate: true } // 立即执行一次回调，以获取初始值
)

const forgetPwdHandler = () => {
  ElMessage.error('功能开发中,请联系管理员')
}

const editPwdHandler = async () => {
  await editPwd(params.value)
  ElMessage.success('修改成功')
}
/*--------------个人资料模块---------------*/
</script>

<template>
  <page-container title="修改密码" v-if="isPwd == 1">
    <template #extra>
      <el-button type="primary" @click="forgetPwdHandler">忘记密码</el-button>
    </template>
    <div class="input_box">
      <el-form :rules="rules" :model="params">
        <div class="input">
          <el-form-item prop="oldPwd">
            <span>旧密码</span>
            <el-input v-model="params.oldPwd" style="width: 240px" type="password" placeholder="请输入旧密码" show-password> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item prop="newPwd">
            <span>新密码</span>
            <el-input v-model="params.newPwd" style="width: 240px" type="password" placeholder="请输入新密码" show-password> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item prop="rePwd">
            <span>新密码</span>
            <el-input v-model="params.rePwd" style="width: 240px" type="password" placeholder="请输入新密码" show-password> </el-input>
          </el-form-item>
        </div>
      </el-form>

      <div class="button">
        <el-button type="primary" @click="editPwdHandler">修改密码</el-button>
      </div>
    </div>
  </page-container>
  <page-container title="个人资料" v-else>
    <template #extra>
      <el-button type="primary">保存信息</el-button>
    </template>
    <div class="input_box">
      <el-form :rules="rules" :model="params">
        <div class="input">
          <el-form-item>
            <span>用户名</span>
            <el-input :model-value="params.username" disabled style="width: 240px"> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item prop="phone">
            <span>手机号</span>
            <el-input v-model="params.phone" placeholder="-" style="width: 240px"> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item prop="tname">
            <span>真实姓名</span>
            <el-input v-model="params.tname" style="width: 240px" placeholder="-"> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item>
            <span>注册时间</span>
            <el-input disabled :model-value="params.createTime" style="width: 240px" placeholder="-"> </el-input>
          </el-form-item>
        </div>
        <div class="input">
          <el-form-item>
            <span>答题进度</span>
            <el-input disabled :model-value="params.currentQs" style="width: 240px" placeholder="-"> </el-input>
          </el-form-item>
        </div>
      </el-form>
      <!-- <div class="button"> -->
      <!-- <el-button type="primary" @click="forgetPwdHandler">忘记密码</el-button> -->
      <!-- <el-button type="primary" @click="editPwdHandler">修改信息</el-button> -->
      <!-- </div> -->
    </div>
  </page-container>
</template>
<style lang="less" scoped>
.input_box {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .input {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    span {
      margin-right: 10px;
    }
  }
  .button {
    margin-top: 40px;
  }
}
</style>
