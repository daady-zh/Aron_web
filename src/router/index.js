import { createRouter, createWebHistory } from 'vue-router'
import isMobile from '@/utils/isMobile'
import { useUserStore } from '@/stores'
import mbRoutes from '@/router/MbRoute'
import pcRoutes from '@/router/PcRoute'

// 根据不同设备动态分配路由
const getRoutes = isMobile ? mbRoutes : pcRoutes

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes
})

/* 登陆访问拦截
   undefined/true直接放行
   false 拦回from的地址
   具体路径或路径对象拦截到对应的地址
   '/login'   { name: 'login' }  
*/
router.beforeEach(async (to) => {
  const userStore = useUserStore()
  if (userStore.access_token) {
    // 如果用户已经登录，且尝试访问登录页，重定向到主页
    if (to.path === '/login') {
      return '/home'
    }
    // 用户权限默认cfcd208495d565ef66e7dff9f98764da，不允许访问部门模块
    // c4ca4238a0b923820dcc509a6f75849b权限1
    if (userStore.author !== 'c4ca4238a0b923820dcc509a6f75849b' && to.path === '/department/tech') {
      ElMessage({
        message: '您无权访问此模块',
        type: 'error'
      })
      return false
    }
    // 对于已登录用户尝试访问的其他页面，允许正常访问
    return true
  } else {
    // 如果用户未登录，且尝试访问需要登录的页面，则提示错误并重定向到登录页
    if (to.path !== '/login') {
      ElMessage({
        message: '非法操作，请先登录',
        type: 'error'
      })
    }
    // 对于未登录用户尝试访问登录页，允许正常访问
    return to.path === '/login' || '/login'
  }
})
export default router
