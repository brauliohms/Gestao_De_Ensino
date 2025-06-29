import 'vue-toastification/dist/index.css'
import './assets/main.css'

import { options } from '@/config/toast.config'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import Toast from 'vue-toastification'
import { LoginUseCase } from './core/auth/application/usecases/Login.usecase'
import { LogoutUseCase } from './core/auth/application/usecases/Logout.usecase'
import { AuthAPIDataSourceMock } from './core/auth/infra/datasources/AuthAPIDataSource.mock'
import { TokenDataSourceFactory } from './core/auth/infra/datasources/TokenDataSource.factory'
import { AuthServiceHTTP } from './core/auth/infra/services/AuthService.HTTP'
import AxiosAdapter from './infra/HttpClient.axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const app = createApp(App)

const authApiDataSource = new AuthAPIDataSourceMock()
// TODO: Adicionar variável de ambiente no create(process.env.VITE...) da factory
const tokenStorageDataSource = TokenDataSourceFactory.create()
app.provide('tokenDataSource', tokenStorageDataSource)
const authService = new AuthServiceHTTP(authApiDataSource, tokenStorageDataSource)
app.provide('authService', authService)
const httpClient = new AxiosAdapter(authService, BASE_URL)
app.provide('httpClient', httpClient)

const loginUseCase = new LoginUseCase(authService)
app.provide('loginUseCase', loginUseCase)
const logoutUseCase = new LogoutUseCase(authService)
app.provide('logoutUseCase', logoutUseCase)

app.use(createPinia())
app.use(router)
app.use(Toast, options)
app.mount('#app')
