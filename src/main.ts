import 'vue-toastification/dist/index.css'
import './assets/main.css'

import { options } from '@/config/toast.config'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import Toast from 'vue-toastification'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, options)
app.mount('#app')
