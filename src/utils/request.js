import { useUserStore } from '@/stores/modules/user'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

// const baseURL = '/api/'
const baseURL = 'http://127.0.0.1:8787'
const request = axios.create({
  // 1.基地址，超时时间
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // withCredentials: true,
  timeout: 100000
})

request.interceptors.request.use(
  (config) => {
    // 2.携带token
    const userStore = useUserStore()
    if (userStore.access_token) {
      config.headers.Authorization = 'Bearer ' + userStore.access_token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 定义是否已经报错
let isError = false
request.interceptors.response.use(
  (res) => {
    // 3.处理业务失败
    // 4.摘取核心响应数据
    if (res.status === 200 || res.status === 201) {
      return res
    }
    if (!isError) {
      ElMessage({ message: res.data.msg || '服务异常', type: 'error' })
      isError = true
      // 设置一个时间，之后重置标志
      setTimeout(() => {
        isError = false
      }, 1000)
    }
    return res
  },
  (err) => {
    // 5.处理401错误
    if (!isError) {
      ElMessage({ message: err.response.data.msg || '服务异常', type: 'error' })
      isError = true
      setTimeout(() => {
        isError = false
      }, 1000)
    }
    if (err.response?.status === 401) {
      const userStore = useUserStore()
      userStore.access_token = ''
      userStore.author = ''
      router.push('/login')
    }
    return Promise.reject(err.response)
  }
)

export default request
export { baseURL }
