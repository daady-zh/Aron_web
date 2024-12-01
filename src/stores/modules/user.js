import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'user',
  () => {
    const access_token = ref('') // 登录token
    const author = ref('') // 用户权限
    const userInfo = ref({}) // 用户信息

    // 设置token
    const setToken = (newToken) => {
      access_token.value = newToken
    }
    // 移除token
    const removeToken = () => {
      access_token.value = ''
    }

    // 设置用户权限
    const setAuthor = (newAuthor) => {
      author.value = newAuthor
    }

    // 移除用户权限
    const removeAuthor = () => {
      author.value = ''
    }

    // 设置用户信息
    const setUserInfo = (newUserInfo) => {
      userInfo.value = newUserInfo
    }

    // 移除用户信息
    const removeUserInfo = () => {
      userInfo.value = {}
    }

    return {
      access_token,
      author,
      userInfo,
      setUserInfo,
      removeUserInfo,
      setToken,
      removeToken,
      setAuthor,
      removeAuthor
    }
  },
  {
    persist: true
  }
)
