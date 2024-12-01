import { createApp } from 'vue'
import pinia from '@/stores/index'
import App from './App.vue'
import '@/assets/main.less'
import router from './router'

const app = createApp(App)
// useVant(app)
app.use(pinia)
app.use(router)
app.mount('#app')

export default app
