import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入样式系统
import './assets/styles/variables.css'
import './assets/styles/reset.css'
import './assets/styles/layout.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
