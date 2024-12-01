const loadView = (module, view) => {
  return () => import(`@/views/${module}/Pc${view}.vue`)
}
const NotFoundComponent = () => import('@/views/layout/NotFound.vue')

const routes = [
  // 一级路由
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录页' },
    component: () => import('@/views/login/PcLogin.vue')
  },
  {
    path: '/pdfview',
    name: 'pdfview',
    component: () => import('@/components/PdfView.vue')
  },
  {
    path: '/:pathMatch(.*)*', // Vue Router 4的通配符路径
    name: 'NotFound',
    component: NotFoundComponent,
    meta: { title: '404 Not Found' }
  },
  // 架子
  {
    path: '/layout',
    meta: { title: '首页' },
    component: () => import('@/views/layout/PcLayout.vue'),
    redirect: '/home',
    // 二级路由
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '首页' },
        component: loadView('layout', 'Home')
      },
      {
        path: '/user',
        name: 'user',
        meta: { title: '用户信息' },
        component: () => import('@/views/user/PcUser.vue')
      },
      {
        path: '/modules/vibration',
        name: 'modules-vibration',
        meta: { title: '振动分析' },
        component: loadView('modules', 'Vibration')
      },
      {
        path: '/modules/standard',
        name: 'modules-standard',
        meta: { title: '标准速查' },
        component: loadView('modules', 'Standard')
      },
      {
        path: '/modules/question',
        name: 'modules-question',
        meta: { title: '执照英语' },
        component: loadView('modules', 'Question')
      },
      {
        path: '/department/tech',
        name: 'department-tech',
        meta: { title: '技术室' },
        component: loadView('department', 'Tech')
      },
      {
        path: '/department/training',
        name: 'department-training',
        meta: { title: '培训室' },
        component: loadView('department', 'Training')
      }
    ]
  }
]

export default routes
